'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X, Clock, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { searchService, SearchResult, SearchFilter, SearchOptions } from '@/lib/services/search-service';

interface GlobalSearchProps {
  userId?: string;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
  defaultModule?: string;
  onResultSelect?: (result: SearchResult) => void;
}

export function GlobalSearch({
  userId,
  placeholder = "Search across all modules...",
  className,
  showFilters = true,
  defaultModule,
  onResultSelect
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilterPanel] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({
    modules: defaultModule ? [defaultModule] : undefined
  });
  const [options, setOptions] = useState<SearchOptions>({
    limit: 10,
    sortBy: 'relevance'
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent-searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchService.search(searchQuery, filters, options, userId);
      setResults(response.results);
      setShowResults(true);
      saveRecentSearch(searchQuery);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [filters, options, userId, saveRecentSearch]);

  // Get suggestions
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const suggestionResults = await searchService.suggest(searchQuery, 5);
      setSuggestions(suggestionResults);
    } catch (error) {
      console.error('Suggestions error:', error);
      setSuggestions([]);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = useCallback((value: string) => {
    setQuery(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        performSearch(value);
        getSuggestions(value);
      } else {
        setResults([]);
        setSuggestions([]);
        setShowResults(false);
      }
    }, 300);
  }, [performSearch, getSuggestions]);

  // Handle result selection
  const handleResultSelect = useCallback((result: SearchResult) => {
    setShowResults(false);
    setQuery('');

    if (onResultSelect) {
      onResultSelect(result);
    } else if (result.url) {
      window.open(result.url, '_blank');
    }
  }, [onResultSelect]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  }, [performSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<SearchFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    if (query.trim()) {
      performSearch(query);
    }
  }, [query, performSearch]);

  // Handle option changes
  const handleOptionChange = useCallback((newOptions: Partial<SearchOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
    if (query.trim()) {
      performSearch(query);
    }
  }, [query, performSearch]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getModuleIcon = (module: string) => {
    const icons = {
      inventory: '📦',
      sales: '💰',
      crm: '👥',
      finance: '💳',
      production: '🏭',
      supply_chain: '🚚',
      analytics: '📊',
      ecommerce: '🛒'
    };
    return icons[module] || '📄';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      product: 'bg-blue-100 text-blue-800',
      customer: 'bg-green-100 text-green-800',
      sale: 'bg-purple-100 text-purple-800',
      order: 'bg-orange-100 text-orange-800',
      invoice: 'bg-red-100 text-red-800',
      report: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (query.trim()) setShowResults(true);
            }}
            className="pl-10 pr-12"
          />
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilters)}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                setResults([]);
                setShowResults(false);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isSearching && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Search Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium">Modules</label>
                <Select
                  value={filters.modules?.[0] || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange({ modules: value === 'all' ? undefined : [value] })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="crm">CRM</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium">Sort By</label>
                <Select
                  value={options.sortBy || 'relevance'}
                  onValueChange={(value) =>
                    handleOptionChange({ sortBy: value as 'relevance' | 'date' | 'title' })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exact-match"
                  checked={options.exactMatch || false}
                  onCheckedChange={(checked) =>
                    handleOptionChange({ exactMatch: checked as boolean })
                  }
                />
                <label htmlFor="exact-match" className="text-xs">
                  Exact match
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-archived"
                  checked={options.includeArchived || false}
                  onCheckedChange={(checked) =>
                    handleOptionChange({ includeArchived: checked as boolean })
                  }
                />
                <label htmlFor="include-archived" className="text-xs">
                  Include archived
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Panel */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-40 mt-1 max-h-96 overflow-hidden">
          <CardContent className="p-0">
            {query && results.length === 0 && !isSearching && (
              <div className="p-4 text-center text-muted-foreground">
                <div>No results found for "{query}"</div>
                {suggestions.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">Did you mean:</div>
                    <div className="flex flex-wrap gap-1">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="link"
                          size="sm"
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="h-auto p-1 text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!query && recentSearches.length > 0 && (
              <div className="p-3">
                <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Recent Searches
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSuggestionSelect(search)}
                      className="w-full justify-start h-auto p-2 text-xs"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto">
                <div className="space-y-1">
                  {results.map((result) => (
                    <SearchResultItem
                      key={result.id}
                      result={result}
                      onSelect={handleResultSelect}
                      getModuleIcon={getModuleIcon}
                      getTypeColor={getTypeColor}
                    />
                  ))}
                </div>

                {results.length >= (options.limit || 10) && (
                  <div className="p-3 border-t bg-muted/30">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        // Open full search results page
                        const searchParams = new URLSearchParams({
                          q: query,
                          ...(filters.modules && { modules: filters.modules.join(',') })
                        });
                        window.open(`/search?${searchParams.toString()}`, '_blank');
                      }}
                      className="w-full text-xs"
                    >
                      View all results
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface SearchResultItemProps {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
  getModuleIcon: (module: string) => string;
  getTypeColor: (type: string) => string;
}

function SearchResultItem({ result, onSelect, getModuleIcon, getTypeColor }: SearchResultItemProps) {
  const formatScore = (score: number) => {
    return Math.round(score * 100) / 100;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div
      onClick={() => onSelect(result)}
      className="p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 transition-colors"
    >
      <div className="flex items-start space-x-3">
        <div className="text-lg">{getModuleIcon(result.module)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium truncate">{result.title}</h3>
            <div className="flex items-center space-x-1 ml-2">
              <Badge variant="outline" className={`text-xs ${getTypeColor(result.type)}`}>
                {result.type}
              </Badge>
              {result.url && (
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {result.description}
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {result.module}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(result.updatedAt)}
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              Score: {formatScore(result.score)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}