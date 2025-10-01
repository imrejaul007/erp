import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Tag,
  Package,
  Zap,
  Heart,
  AlertCircle,
  ChevronDown,
  X,
  ScanLine
} from 'lucide-react';

const ProductSearch = ({ onProductSelect, touchMode = true, storeId }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockFilter, setStockFilter] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState(false);
  const [quickFilters, setQuickFilters] = useState([]);

  const searchInputRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
    setupQuickFilters();
  }, [storeId]);

  // Filter products when search criteria change
  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, stockFilter, featuredOnly, newArrivalsOnly]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?storeId=${storeId}&includeStock=true`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?active=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands?active=true');
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const setupQuickFilters = () => {
    setQuickFilters([
      { id: 'perfumes', label: 'Perfumes', icon: '🌹', category: 'perfumes' },
      { id: 'oud', label: 'Oud', icon: '🪵', category: 'oud' },
      { id: 'attar', label: 'Attar', icon: '💧', category: 'attar' },
      { id: 'accessories', label: 'Accessories', icon: '✨', category: 'accessories' },
      { id: 'gift-sets', label: 'Gift Sets', icon: '🎁', category: 'gift-sets' },
      { id: 'bestsellers', label: 'Best Sellers', icon: '⭐', special: 'bestsellers' }
    ]);
  };

  const filterProducts = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      let filtered = [...products];

      // Text search
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(search) ||
          product.sku.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search) ||
          product.arabicName?.toLowerCase().includes(search) ||
          product.brand?.name.toLowerCase().includes(search) ||
          product.category?.name.toLowerCase().includes(search)
        );
      }

      // Category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product =>
          product.category?._id === selectedCategory ||
          product.category?.slug === selectedCategory
        );
      }

      // Brand filter
      if (selectedBrand !== 'all') {
        filtered = filtered.filter(product =>
          product.brand?._id === selectedBrand ||
          product.brand?.slug === selectedBrand
        );
      }

      // Price range filter
      if (priceRange.min !== '' || priceRange.max !== '') {
        filtered = filtered.filter(product => {
          const price = product.retailPrice || product.basePrice || 0;
          const min = priceRange.min !== '' ? parseFloat(priceRange.min) : 0;
          const max = priceRange.max !== '' ? parseFloat(priceRange.max) : Infinity;
          return price >= min && price <= max;
        });
      }

      // Stock filter
      if (stockFilter !== 'all') {
        filtered = filtered.filter(product => {
          const stock = product.stock?.quantity || 0;
          switch (stockFilter) {
            case 'in_stock':
              return stock > 0;
            case 'low_stock':
              return stock > 0 && stock <= (product.stock?.minLevel || 5);
            case 'out_of_stock':
              return stock === 0;
            default:
              return true;
          }
        });
      }

      // Featured filter
      if (featuredOnly) {
        filtered = filtered.filter(product => product.featured);
      }

      // New arrivals filter
      if (newArrivalsOnly) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(product =>
          new Date(product.createdAt) >= thirtyDaysAgo
        );
      }

      // Sort products
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price_low':
            return (a.retailPrice || a.basePrice || 0) - (b.retailPrice || b.basePrice || 0);
          case 'price_high':
            return (b.retailPrice || b.basePrice || 0) - (a.retailPrice || a.basePrice || 0);
          case 'stock':
            return (b.stock?.quantity || 0) - (a.stock?.quantity || 0);
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'popular':
            return (b.salesCount || 0) - (a.salesCount || 0);
          default:
            return 0;
        }
      });

      setFilteredProducts(filtered);
    }, 300);
  };

  const handleQuickFilter = (filter) => {
    if (filter.category) {
      setSelectedCategory(filter.category);
    }
    if (filter.special === 'bestsellers') {
      setSortBy('popular');
    }
    setSearchTerm('');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange({ min: '', max: '' });
    setStockFilter('all');
    setFeaturedOnly(false);
    setNewArrivalsOnly(false);
    setSortBy('name');
  };

  const getStockStatus = (product) => {
    const stock = product.stock?.quantity || 0;
    const minLevel = product.stock?.minLevel || 5;

    if (stock === 0) return { status: 'out', color: 'text-red-600', label: 'Out of Stock' };
    if (stock <= minLevel) return { status: 'low', color: 'text-orange-600', label: 'Low Stock' };
    return { status: 'in', color: 'text-green-600', label: 'In Stock' };
  };

  const QuickFilters = () => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {quickFilters.map(filter => (
          <button
            key={filter.id}
            onClick={() => handleQuickFilter(filter)}
            className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl mb-1">{filter.icon}</span>
            <span className="text-xs font-medium text-gray-700 text-center">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const SearchBar = () => (
    <div className="relative mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products, SKU, or scan barcode..."
          className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            touchMode ? 'text-lg' : 'text-sm'
          }`}
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
            showFilters ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const FiltersPanel = () => (
    showFilters && (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Brands</option>
              {brands.map(brand => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name A-Z</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="stock">Stock Level</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (AED)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              placeholder="Min"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              placeholder="Max"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Toggle Filters */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Featured Only</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newArrivalsOnly}
              onChange={(e) => setNewArrivalsOnly(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">New Arrivals</span>
          </label>
        </div>
      </div>
    )
  );

  const ViewModeToggle = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="text-sm text-gray-600">
        {filteredProducts.length} products found
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => {
    const stockStatus = getStockStatus(product);
    const price = product.retailPrice || product.basePrice || 0;

    if (viewMode === 'list') {
      return (
        <div
          onClick={() => onProductSelect(product)}
          className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          <div className="ml-4 flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
            <p className="text-sm text-gray-500 truncate">{product.sku}</p>
            <div className="flex items-center mt-1">
              <span className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</span>
              {product.featured && <Star className="w-3 h-3 text-yellow-500 ml-2" />}
            </div>
          </div>

          <div className="text-right">
            <div className="font-semibold text-gray-900">AED {price.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Stock: {product.stock?.quantity || 0}</div>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => onProductSelect(product)}
        className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all cursor-pointer ${
          touchMode ? 'min-h-[200px]' : 'min-h-[180px]'
        }`}
      >
        <div className={`relative ${touchMode ? 'h-32' : 'h-28'} bg-gray-100`}>
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          )}

          {/* Stock indicator */}
          <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
            stockStatus.status === 'in' ? 'bg-green-500' :
            stockStatus.status === 'low' ? 'bg-orange-500' : 'bg-red-500'
          }`} />

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
              <Star className="w-3 h-3 inline" />
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className={`font-medium text-gray-900 truncate ${touchMode ? 'text-base' : 'text-sm'}`}>
            {product.name}
          </h3>
          <p className={`text-gray-500 truncate ${touchMode ? 'text-sm' : 'text-xs'}`}>
            {product.sku}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className={`font-semibold text-gray-900 ${touchMode ? 'text-base' : 'text-sm'}`}>
              AED {price.toFixed(2)}
            </span>
            <span className={`text-gray-500 ${touchMode ? 'text-sm' : 'text-xs'}`}>
              Stock: {product.stock?.quantity || 0}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <QuickFilters />
      <SearchBar />
      <FiltersPanel />
      <ViewModeToggle />

      {/* Products Grid/List */}
      <div className="flex-1 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Search className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-center">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? `grid gap-4 ${touchMode ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'}`
              : 'space-y-3'
          }>
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;