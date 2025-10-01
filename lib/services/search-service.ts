import { prisma } from '@/lib/prisma';
import { AuditService } from './audit-service';

export interface SearchResult {
  id: string;
  type: string;
  module: string;
  title: string;
  description: string;
  data: Record<string, any>;
  score: number;
  url?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilter {
  modules?: string[];
  types?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  categories?: string[];
  tags?: string[];
  userId?: string;
  customFilters?: Record<string, any>;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
  includeArchived?: boolean;
  fuzzySearch?: boolean;
  exactMatch?: boolean;
  facets?: boolean;
}

export interface SearchFacets {
  modules: Array<{ name: string; count: number }>;
  types: Array<{ name: string; count: number }>;
  status: Array<{ name: string; count: number }>;
  dateRanges: Array<{ name: string; count: number }>;
  tags: Array<{ name: string; count: number }>;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  facets?: SearchFacets;
  suggestions?: string[];
  correctedQuery?: string;
  searchTime: number;
}

export interface IndexedDocument {
  id: string;
  type: string;
  module: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
  tags: string[];
  permissions: {
    public: boolean;
    roles: string[];
    users: string[];
  };
  status: 'active' | 'archived' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export class SearchService {
  private static instance: SearchService;
  private searchIndex: Map<string, IndexedDocument> = new Map();
  private invertedIndex: Map<string, Set<string>> = new Map();
  private synonyms: Map<string, string[]> = new Map();
  private stopWords: Set<string> = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
  ]);

  constructor() {
    this.initializeSynonyms();
    this.rebuildIndex();
  }

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  // Main search method
  async search(
    query: string,
    filters: SearchFilter = {},
    options: SearchOptions = {},
    userId?: string
  ): Promise<SearchResponse> {
    const startTime = Date.now();

    try {
      // Log search query
      if (userId) {
        await AuditService.logActivity({
          userId,
          action: 'search_performed',
          module: 'search',
          details: { query, filters, options },
          timestamp: new Date()
        });
      }

      // Normalize and process query
      const processedQuery = this.processQuery(query);

      // Get candidate documents
      const candidates = this.getCandidateDocuments(processedQuery, filters);

      // Score and rank results
      const scoredResults = this.scoreDocuments(candidates, processedQuery);

      // Apply filters
      const filteredResults = this.applyFilters(scoredResults, filters, userId);

      // Sort results
      const sortedResults = this.sortResults(filteredResults, options);

      // Paginate
      const paginatedResults = this.paginateResults(sortedResults, options);

      // Convert to search results
      const searchResults = await this.convertToSearchResults(paginatedResults);

      // Generate facets if requested
      let facets: SearchFacets | undefined;
      if (options.facets) {
        facets = this.generateFacets(filteredResults);
      }

      // Generate suggestions
      const suggestions = this.generateSuggestions(query, searchResults.length);

      const searchTime = Date.now() - startTime;

      return {
        results: searchResults,
        total: filteredResults.length,
        facets,
        suggestions,
        searchTime
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        results: [],
        total: 0,
        searchTime: Date.now() - startTime
      };
    }
  }

  // Module-specific search methods
  async searchInventory(query: string, userId?: string): Promise<SearchResult[]> {
    const response = await this.search(query, { modules: ['inventory'] }, {}, userId);
    return response.results;
  }

  async searchCustomers(query: string, userId?: string): Promise<SearchResult[]> {
    const response = await this.search(query, { modules: ['crm'], types: ['customer'] }, {}, userId);
    return response.results;
  }

  async searchSales(query: string, userId?: string): Promise<SearchResult[]> {
    const response = await this.search(query, { modules: ['sales'] }, {}, userId);
    return response.results;
  }

  async searchProducts(query: string, userId?: string): Promise<SearchResult[]> {
    const response = await this.search(query, { types: ['product'] }, {}, userId);
    return response.results;
  }

  // Advanced search with custom filters
  async advancedSearch(
    query: string,
    advancedFilters: {
      productCategory?: string;
      priceRange?: { min: number; max: number };
      stockLevel?: 'low' | 'medium' | 'high';
      customerType?: string;
      salesDateRange?: { start: Date; end: Date };
      customFields?: Record<string, any>;
    },
    userId?: string
  ): Promise<SearchResponse> {
    const filters: SearchFilter = {
      customFilters: advancedFilters
    };

    return await this.search(query, filters, { facets: true }, userId);
  }

  // Autocomplete/suggestions
  async suggest(query: string, limit: number = 5): Promise<string[]> {
    if (query.length < 2) return [];

    const suggestions: Set<string> = new Set();
    const normalizedQuery = query.toLowerCase();

    // Search in document titles
    for (const doc of this.searchIndex.values()) {
      if (doc.status !== 'active') continue;

      const title = doc.title.toLowerCase();
      if (title.includes(normalizedQuery)) {
        suggestions.add(doc.title);
        if (suggestions.size >= limit) break;
      }
    }

    // Search in content
    if (suggestions.size < limit) {
      for (const doc of this.searchIndex.values()) {
        if (doc.status !== 'active') continue;

        const content = doc.content.toLowerCase();
        const words = content.split(/\s+/);

        for (const word of words) {
          if (word.startsWith(normalizedQuery) && !this.stopWords.has(word)) {
            suggestions.add(word);
            if (suggestions.size >= limit) break;
          }
        }

        if (suggestions.size >= limit) break;
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }

  // Index management
  async indexDocument(document: Omit<IndexedDocument, 'createdAt' | 'updatedAt'>): Promise<void> {
    const doc: IndexedDocument = {
      ...document,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.searchIndex.set(doc.id, doc);
    this.updateInvertedIndex(doc);

    // Persist to database
    await this.persistDocument(doc);
  }

  async updateDocument(id: string, updates: Partial<IndexedDocument>): Promise<void> {
    const existing = this.searchIndex.get(id);
    if (!existing) return;

    const updated: IndexedDocument = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.searchIndex.set(id, updated);
    this.removeFromInvertedIndex(existing);
    this.updateInvertedIndex(updated);

    // Persist to database
    await this.persistDocument(updated);
  }

  async removeDocument(id: string): Promise<void> {
    const doc = this.searchIndex.get(id);
    if (doc) {
      this.removeFromInvertedIndex(doc);
      this.searchIndex.delete(id);

      // Mark as deleted in database
      await this.markDocumentDeleted(id);
    }
  }

  // Bulk indexing for modules
  async indexModule(module: string): Promise<number> {
    let indexed = 0;

    try {
      switch (module) {
        case 'inventory':
          indexed = await this.indexInventoryData();
          break;
        case 'crm':
          indexed = await this.indexCRMData();
          break;
        case 'sales':
          indexed = await this.indexSalesData();
          break;
        case 'finance':
          indexed = await this.indexFinanceData();
          break;
        case 'production':
          indexed = await this.indexProductionData();
          break;
        default:
          console.warn(`Unknown module for indexing: ${module}`);
      }

      await AuditService.logActivity({
        userId: 'system',
        action: 'module_indexed',
        module: 'search',
        details: { module, documentCount: indexed },
        timestamp: new Date()
      });
    } catch (error) {
      console.error(`Failed to index module ${module}:`, error);
    }

    return indexed;
  }

  // Rebuild entire search index
  async rebuildIndex(): Promise<void> {
    try {
      this.searchIndex.clear();
      this.invertedIndex.clear();

      // Load existing documents from database
      await this.loadExistingDocuments();

      // Index all modules
      const modules = ['inventory', 'crm', 'sales', 'finance', 'production'];
      for (const module of modules) {
        await this.indexModule(module);
      }

      await AuditService.logActivity({
        userId: 'system',
        action: 'search_index_rebuilt',
        module: 'search',
        details: { documentCount: this.searchIndex.size },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to rebuild search index:', error);
    }
  }

  // Private helper methods
  private processQuery(query: string): string[] {
    // Normalize query
    const normalized = query.toLowerCase().trim();

    // Remove special characters
    const cleaned = normalized.replace(/[^\w\s]/g, ' ');

    // Split into words and remove stop words
    const words = cleaned.split(/\s+/).filter(word =>
      word.length > 1 && !this.stopWords.has(word)
    );

    // Add synonyms
    const expandedWords: string[] = [];
    for (const word of words) {
      expandedWords.push(word);
      const synonyms = this.synonyms.get(word);
      if (synonyms) {
        expandedWords.push(...synonyms);
      }
    }

    return [...new Set(expandedWords)];
  }

  private getCandidateDocuments(queryWords: string[], filters: SearchFilter): IndexedDocument[] {
    const candidates: Set<string> = new Set();

    // If no query words, return all documents (with filters)
    if (queryWords.length === 0) {
      for (const doc of this.searchIndex.values()) {
        if (doc.status === 'active') {
          candidates.add(doc.id);
        }
      }
    } else {
      // Find documents containing query words
      for (const word of queryWords) {
        const docIds = this.invertedIndex.get(word);
        if (docIds) {
          for (const docId of docIds) {
            candidates.add(docId);
          }
        }
      }
    }

    return Array.from(candidates)
      .map(id => this.searchIndex.get(id))
      .filter((doc): doc is IndexedDocument => doc !== undefined);
  }

  private scoreDocuments(documents: IndexedDocument[], queryWords: string[]): Array<{ doc: IndexedDocument; score: number }> {
    return documents.map(doc => ({
      doc,
      score: this.calculateScore(doc, queryWords)
    }));
  }

  private calculateScore(doc: IndexedDocument, queryWords: string[]): number {
    let score = 0;

    for (const word of queryWords) {
      // Title matches get higher score
      const titleMatches = (doc.title.toLowerCase().match(new RegExp(word, 'g')) || []).length;
      score += titleMatches * 3;

      // Content matches
      const contentMatches = (doc.content.toLowerCase().match(new RegExp(word, 'g')) || []).length;
      score += contentMatches;

      // Tag matches
      const tagMatches = doc.tags.filter(tag => tag.toLowerCase().includes(word)).length;
      score += tagMatches * 2;

      // Exact phrase bonus
      if (doc.title.toLowerCase().includes(queryWords.join(' '))) {
        score += 5;
      }
    }

    // Boost recent documents
    const daysSinceUpdate = (Date.now() - doc.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 30) {
      score *= 1.2;
    }

    return score;
  }

  private applyFilters(
    scoredResults: Array<{ doc: IndexedDocument; score: number }>,
    filters: SearchFilter,
    userId?: string
  ): Array<{ doc: IndexedDocument; score: number }> {
    return scoredResults.filter(({ doc }) => {
      // Module filter
      if (filters.modules && !filters.modules.includes(doc.module)) {
        return false;
      }

      // Type filter
      if (filters.types && !filters.types.includes(doc.type)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        if (doc.createdAt < filters.dateRange.start || doc.createdAt > filters.dateRange.end) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag => doc.tags.includes(tag));
        if (!hasTag) return false;
      }

      // Permission check
      if (userId && !this.hasPermission(doc, userId)) {
        return false;
      }

      // Custom filters
      if (filters.customFilters) {
        // Apply custom filter logic based on document metadata
        for (const [key, value] of Object.entries(filters.customFilters)) {
          if (!this.applyCustomFilter(doc, key, value)) {
            return false;
          }
        }
      }

      return true;
    });
  }

  private hasPermission(doc: IndexedDocument, userId: string): boolean {
    if (doc.permissions.public) return true;
    if (doc.permissions.users.includes(userId)) return true;

    // TODO: Check user roles against doc.permissions.roles
    return true; // For now, allow all
  }

  private applyCustomFilter(doc: IndexedDocument, key: string, value: any): boolean {
    switch (key) {
      case 'priceRange':
        const price = doc.metadata.price;
        return price >= value.min && price <= value.max;
      case 'stockLevel':
        const stock = doc.metadata.stock;
        const level = stock < 10 ? 'low' : stock < 100 ? 'medium' : 'high';
        return level === value;
      default:
        return doc.metadata[key] === value;
    }
  }

  private sortResults(
    results: Array<{ doc: IndexedDocument; score: number }>,
    options: SearchOptions
  ): Array<{ doc: IndexedDocument; score: number }> {
    const sortBy = options.sortBy || 'relevance';
    const sortOrder = options.sortOrder || 'desc';

    return results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'relevance':
          comparison = b.score - a.score;
          break;
        case 'date':
          comparison = b.doc.updatedAt.getTime() - a.doc.updatedAt.getTime();
          break;
        case 'title':
          comparison = a.doc.title.localeCompare(b.doc.title);
          break;
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });
  }

  private paginateResults(
    results: Array<{ doc: IndexedDocument; score: number }>,
    options: SearchOptions
  ): Array<{ doc: IndexedDocument; score: number }> {
    const limit = options.limit || 20;
    const offset = options.offset || 0;
    return results.slice(offset, offset + limit);
  }

  private async convertToSearchResults(
    scoredDocs: Array<{ doc: IndexedDocument; score: number }>
  ): Promise<SearchResult[]> {
    return scoredDocs.map(({ doc, score }) => ({
      id: doc.id,
      type: doc.type,
      module: doc.module,
      title: doc.title,
      description: doc.content.substring(0, 200) + '...',
      data: doc.metadata,
      score,
      url: this.generateURL(doc),
      thumbnail: doc.metadata.thumbnail,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));
  }

  private generateURL(doc: IndexedDocument): string {
    const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return `${baseURL}/${doc.module}/${doc.type}/${doc.id}`;
  }

  private generateFacets(results: Array<{ doc: IndexedDocument; score: number }>): SearchFacets {
    const facets: SearchFacets = {
      modules: [],
      types: [],
      status: [],
      dateRanges: [],
      tags: []
    };

    // Count by module
    const moduleCounts = new Map<string, number>();
    const typeCounts = new Map<string, number>();
    const tagCounts = new Map<string, number>();

    for (const { doc } of results) {
      moduleCounts.set(doc.module, (moduleCounts.get(doc.module) || 0) + 1);
      typeCounts.set(doc.type, (typeCounts.get(doc.type) || 0) + 1);

      for (const tag of doc.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }

    facets.modules = Array.from(moduleCounts.entries()).map(([name, count]) => ({ name, count }));
    facets.types = Array.from(typeCounts.entries()).map(([name, count]) => ({ name, count }));
    facets.tags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return facets;
  }

  private generateSuggestions(query: string, resultCount: number): string[] {
    if (resultCount > 0) return [];

    // Generate did-you-mean suggestions
    const suggestions: string[] = [];
    const words = query.toLowerCase().split(/\s+/);

    for (const word of words) {
      // Find similar words in the index
      for (const indexedWord of this.invertedIndex.keys()) {
        if (this.calculateLevenshteinDistance(word, indexedWord) <= 2) {
          suggestions.push(query.replace(word, indexedWord));
        }
      }
    }

    return suggestions.slice(0, 3);
  }

  private calculateLevenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private updateInvertedIndex(doc: IndexedDocument): void {
    const words = this.extractWords(doc);

    for (const word of words) {
      if (!this.invertedIndex.has(word)) {
        this.invertedIndex.set(word, new Set());
      }
      this.invertedIndex.get(word)!.add(doc.id);
    }
  }

  private removeFromInvertedIndex(doc: IndexedDocument): void {
    const words = this.extractWords(doc);

    for (const word of words) {
      const docIds = this.invertedIndex.get(word);
      if (docIds) {
        docIds.delete(doc.id);
        if (docIds.size === 0) {
          this.invertedIndex.delete(word);
        }
      }
    }
  }

  private extractWords(doc: IndexedDocument): Set<string> {
    const words = new Set<string>();
    const text = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`;

    const processedWords = this.processQuery(text);
    processedWords.forEach(word => words.add(word));

    return words;
  }

  private initializeSynonyms(): void {
    // Initialize common synonyms
    this.synonyms.set('product', ['item', 'goods', 'merchandise']);
    this.synonyms.set('customer', ['client', 'buyer', 'patron']);
    this.synonyms.set('order', ['purchase', 'transaction', 'sale']);
    this.synonyms.set('inventory', ['stock', 'warehouse', 'storage']);
    this.synonyms.set('price', ['cost', 'amount', 'value']);
  }

  // Module-specific indexing methods
  private async indexInventoryData(): Promise<number> {
    try {
      const products = await prisma.product.findMany({
        include: { inventory: true, category: true }
      });

      for (const product of products) {
        await this.indexDocument({
          id: product.id,
          type: 'product',
          module: 'inventory',
          title: product.name,
          content: `${product.name} ${product.description || ''} ${product.sku}`,
          metadata: {
            sku: product.sku,
            price: product.price,
            stock: product.inventory?.quantity || 0,
            category: product.category?.name,
            barcode: product.barcode
          },
          tags: [product.category?.name || 'uncategorized'],
          permissions: { public: true, roles: [], users: [] },
          status: 'active'
        });
      }

      return products.length;
    } catch (error) {
      console.error('Failed to index inventory data:', error);
      return 0;
    }
  }

  private async indexCRMData(): Promise<number> {
    try {
      const customers = await prisma.customer.findMany({
        include: { contacts: true }
      });

      for (const customer of customers) {
        const contacts = customer.contacts.map(c => `${c.firstName} ${c.lastName}`).join(' ');

        await this.indexDocument({
          id: customer.id,
          type: 'customer',
          module: 'crm',
          title: customer.companyName || customer.contacts[0]?.firstName + ' ' + customer.contacts[0]?.lastName || 'Unknown',
          content: `${customer.companyName || ''} ${contacts} ${customer.email || ''} ${customer.phone || ''}`,
          metadata: {
            type: customer.type,
            status: customer.status,
            industry: customer.industry,
            email: customer.email,
            phone: customer.phone
          },
          tags: [customer.type, customer.status],
          permissions: { public: false, roles: ['sales', 'crm'], users: [] },
          status: 'active'
        });
      }

      return customers.length;
    } catch (error) {
      console.error('Failed to index CRM data:', error);
      return 0;
    }
  }

  private async indexSalesData(): Promise<number> {
    try {
      const sales = await prisma.sale.findMany({
        include: { customer: true, items: { include: { product: true } } }
      });

      for (const sale of sales) {
        const products = sale.items.map(item => item.product.name).join(' ');

        await this.indexDocument({
          id: sale.id,
          type: 'sale',
          module: 'sales',
          title: `Sale #${sale.saleNumber}`,
          content: `${sale.saleNumber} ${sale.customer?.companyName || ''} ${products}`,
          metadata: {
            saleNumber: sale.saleNumber,
            totalAmount: sale.totalAmount,
            status: sale.status,
            customerName: sale.customer?.companyName,
            itemCount: sale.items.length
          },
          tags: [sale.status],
          permissions: { public: false, roles: ['sales', 'finance'], users: [] },
          status: 'active'
        });
      }

      return sales.length;
    } catch (error) {
      console.error('Failed to index sales data:', error);
      return 0;
    }
  }

  private async indexFinanceData(): Promise<number> {
    // Similar implementation for finance data
    return 0;
  }

  private async indexProductionData(): Promise<number> {
    // Similar implementation for production data
    return 0;
  }

  private async loadExistingDocuments(): Promise<void> {
    try {
      const documents = await prisma.searchDocument.findMany({
        where: { status: { not: 'deleted' } }
      });

      for (const doc of documents) {
        const indexedDoc: IndexedDocument = {
          id: doc.id,
          type: doc.type,
          module: doc.module,
          title: doc.title,
          content: doc.content,
          metadata: JSON.parse(doc.metadata),
          tags: JSON.parse(doc.tags),
          permissions: JSON.parse(doc.permissions),
          status: doc.status as 'active' | 'archived' | 'deleted',
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        };

        this.searchIndex.set(indexedDoc.id, indexedDoc);
        this.updateInvertedIndex(indexedDoc);
      }
    } catch (error) {
      console.error('Failed to load existing documents:', error);
    }
  }

  private async persistDocument(doc: IndexedDocument): Promise<void> {
    try {
      await prisma.searchDocument.upsert({
        where: { id: doc.id },
        create: {
          id: doc.id,
          type: doc.type,
          module: doc.module,
          title: doc.title,
          content: doc.content,
          metadata: JSON.stringify(doc.metadata),
          tags: JSON.stringify(doc.tags),
          permissions: JSON.stringify(doc.permissions),
          status: doc.status,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        },
        update: {
          title: doc.title,
          content: doc.content,
          metadata: JSON.stringify(doc.metadata),
          tags: JSON.stringify(doc.tags),
          permissions: JSON.stringify(doc.permissions),
          status: doc.status,
          updatedAt: doc.updatedAt
        }
      });
    } catch (error) {
      console.error('Failed to persist document:', error);
    }
  }

  private async markDocumentDeleted(id: string): Promise<void> {
    try {
      await prisma.searchDocument.update({
        where: { id },
        data: { status: 'deleted', updatedAt: new Date() }
      });
    } catch (error) {
      console.error('Failed to mark document as deleted:', error);
    }
  }

  // Public utility methods
  public getIndexStats(): {
    documentCount: number;
    indexSize: number;
    moduleBreakdown: Record<string, number>;
  } {
    const moduleBreakdown: Record<string, number> = {};

    for (const doc of this.searchIndex.values()) {
      moduleBreakdown[doc.module] = (moduleBreakdown[doc.module] || 0) + 1;
    }

    return {
      documentCount: this.searchIndex.size,
      indexSize: this.invertedIndex.size,
      moduleBreakdown
    };
  }

  public async optimizeIndex(): Promise<void> {
    // Remove empty entries from inverted index
    for (const [word, docIds] of this.invertedIndex.entries()) {
      if (docIds.size === 0) {
        this.invertedIndex.delete(word);
      }
    }

    await AuditService.logActivity({
      userId: 'system',
      action: 'search_index_optimized',
      module: 'search',
      details: this.getIndexStats(),
      timestamp: new Date()
    });
  }
}

// Export singleton instance
export const searchService = SearchService.getInstance();