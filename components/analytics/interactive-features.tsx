'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Filter,
  Download,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Search,
  MoreVertical,
  RefreshCw,
  FileText,
  Share,
  Settings,
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { DashboardFilters, DrillDownData, ExportOptions } from '@/types/analytics';

interface InteractiveFeaturesProps {
  onFiltersChange: (filters: DashboardFilters) => void;
  onExport: (options: ExportOptions) => void;
  onDrillDown: (data: DrillDownData) => void;
  currentData?: any;
  isLoading?: boolean;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export default function InteractiveFeatures({
  onFiltersChange,
  onExport,
  onDrillDown,
  currentData,
  isLoading = false,
}: InteractiveFeaturesProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [drillDownPath, setDrillDownPath] = useState<string[]>(['Overview']);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    dateRange: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    },
  });

  // Predefined date ranges
  const dateRangePresets = [
    { label: 'Today', value: 'today', range: { from: new Date(), to: new Date() } },
    { label: 'Yesterday', value: 'yesterday', range: { from: subDays(new Date(), 1), to: subDays(new Date(), 1) } },
    { label: 'Last 7 days', value: '7days', range: { from: subDays(new Date(), 7), to: new Date() } },
    { label: 'Last 30 days', value: '30days', range: { from: subDays(new Date(), 30), to: new Date() } },
    { label: 'This month', value: 'thisMonth', range: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) } },
    { label: 'Last month', value: 'lastMonth', range: {
      from: startOfMonth(subDays(startOfMonth(new Date()), 1)),
      to: endOfMonth(subDays(startOfMonth(new Date()), 1))
    } },
  ];

  // Sample store and category options
  const storeOptions = [
    { value: 'store_001', label: 'Dubai Mall Branch' },
    { value: 'store_002', label: 'Abu Dhabi Branch' },
    { value: 'store_003', label: 'Sharjah Branch' },
    { value: 'store_004', label: 'Online Store' },
  ];

  const categoryOptions = [
    { value: 'premium_oud', label: 'Premium Oud' },
    { value: 'floral', label: 'Floral' },
    { value: 'wood', label: 'Wood' },
    { value: 'musk', label: 'Musk' },
    { value: 'amber', label: 'Amber' },
  ];

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    if (range.from && range.to) {
      const filters: DashboardFilters = {
        dateRange: { start: range.from, end: range.to },
        stores: selectedStores.length > 0 ? selectedStores : undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      };
      onFiltersChange(filters);
    }
  }, [selectedStores, selectedCategories, onFiltersChange]);

  const handlePresetDateRange = (preset: any) => {
    handleDateRangeChange(preset.range);
  };

  const handleStoreChange = (storeId: string) => {
    const newStores = selectedStores.includes(storeId)
      ? selectedStores.filter(id => id !== storeId)
      : [...selectedStores, storeId];
    setSelectedStores(newStores);

    const filters: DashboardFilters = {
      dateRange: dateRange.from && dateRange.to ? { start: dateRange.from, end: dateRange.to } : { start: new Date(), end: new Date() },
      stores: newStores.length > 0 ? newStores : undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    };
    onFiltersChange(filters);
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newCategories);

    const filters: DashboardFilters = {
      dateRange: dateRange.from && dateRange.to ? { start: dateRange.from, end: dateRange.to } : { start: new Date(), end: new Date() },
      stores: selectedStores.length > 0 ? selectedStores : undefined,
      categories: newCategories.length > 0 ? newCategories : undefined,
    };
    onFiltersChange(filters);
  };

  const clearAllFilters = () => {
    setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });
    setSelectedStores([]);
    setSelectedCategories([]);
    setSearchQuery('');

    const filters: DashboardFilters = {
      dateRange: { start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
    };
    onFiltersChange(filters);
  };

  const handleExport = () => {
    const options: ExportOptions = {
      ...exportOptions,
      dateRange: dateRange.from && dateRange.to
        ? { start: dateRange.from, end: dateRange.to }
        : { start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
    };
    onExport(options);
    setIsExportOpen(false);
  };

  const handleDrillDown = (level: string, data: any) => {
    const newPath = [...drillDownPath, level];
    setDrillDownPath(newPath);

    const drillDownData: DrillDownData = {
      level: newPath.length - 1,
      breadcrumb: newPath,
      data,
      canDrillDown: true,
    };
    onDrillDown(drillDownData);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = drillDownPath.slice(0, index + 1);
    setDrillDownPath(newPath);

    const drillDownData: DrillDownData = {
      level: index,
      breadcrumb: newPath,
      data: currentData,
      canDrillDown: index < drillDownPath.length - 1,
    };
    onDrillDown(drillDownData);
  };

  return (
    <div className="space-y-4">
      {/* Filter and Action Bar */}
      <Card className="card-luxury">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Left side - Search and Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-oud-500" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-48"
                />
              </div>

              {/* Date Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-72 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex">
                    {/* Preset options */}
                    <div className="border-r border-oud-200 p-3 space-y-2">
                      <p className="text-sm font-medium text-oud-700">Quick Select</p>
                      {dateRangePresets.map((preset) => (
                        <Button
                          key={preset.value}
                          variant="ghost"
                          className="w-full justify-start text-xs"
                          onClick={() => handlePresetDateRange(preset)}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                    {/* Calendar */}
                    <div className="p-3">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={(range) => range && handleDateRangeChange(range)}
                        numberOfMonths={2}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Advanced Filters Button */}
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {(selectedStores.length > 0 || selectedCategories.length > 0) && (
                      <span className="ml-2 bg-oud-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {selectedStores.length + selectedCategories.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-oud-800 mb-2">Stores</h4>
                      <div className="space-y-2">
                        {storeOptions.map((store) => (
                          <label key={store.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedStores.includes(store.value)}
                              onChange={() => handleStoreChange(store.value)}
                              className="rounded border-oud-300"
                            />
                            <span className="text-sm text-oud-700">{store.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-oud-800 mb-2">Categories</h4>
                      <div className="space-y-2">
                        {categoryOptions.map((category) => (
                          <label key={category.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category.value)}
                              onChange={() => handleCategoryChange(category.value)}
                              className="rounded border-oud-300"
                            />
                            <span className="text-sm text-oud-700">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear All
                      </Button>
                      <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Right side - Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button variant="outline" size="sm">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>

              <Popover open={isExportOpen} onOpenChange={setIsExportOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-4">
                    <h4 className="font-medium text-oud-800">Export Options</h4>

                    <div>
                      <label className="block text-sm font-medium text-oud-700 mb-1">
                        Format
                      </label>
                      <Select
                        value={exportOptions.format}
                        onValueChange={(value: 'pdf' | 'excel' | 'csv') =>
                          setExportOptions({ ...exportOptions, format: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Report</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportOptions.includeCharts}
                          onChange={(e) =>
                            setExportOptions({ ...exportOptions, includeCharts: e.target.checked })
                          }
                          className="rounded border-oud-300"
                        />
                        <span className="text-sm text-oud-700">Include Charts</span>
                      </label>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => setIsExportOpen(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleExport}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breadcrumb Navigation for Drill-down */}
      {drillDownPath.length > 1 && (
        <Card className="card-luxury">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <nav className="flex items-center space-x-2 text-sm">
                {drillDownPath.map((path, index) => (
                  <React.Fragment key={index}>
                    <button
                      onClick={() => handleBreadcrumbClick(index)}
                      className={`px-2 py-1 rounded transition-colors ${
                        index === drillDownPath.length - 1
                          ? 'bg-oud-100 text-oud-800 font-medium'
                          : 'text-oud-600 hover:text-oud-800 hover:bg-oud-50'
                      }`}
                    >
                      {path}
                    </button>
                    {index < drillDownPath.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-oud-400" />
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {(selectedStores.length > 0 || selectedCategories.length > 0 || searchQuery) && (
        <Card className="card-luxury">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-oud-600">Active filters:</span>

                {selectedStores.map((storeId) => {
                  const store = storeOptions.find(s => s.value === storeId);
                  return (
                    <span
                      key={storeId}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                    >
                      Store: {store?.label}
                      <button
                        onClick={() => handleStoreChange(storeId)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}

                {selectedCategories.map((categoryId) => {
                  const category = categoryOptions.find(c => c.value === categoryId);
                  return (
                    <span
                      key={categoryId}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                    >
                      Category: {category?.label}
                      <button
                        onClick={() => handleCategoryChange(categoryId)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}

                {searchQuery && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-oud-600 hover:text-oud-800"
              >
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper component for drill-down enabled charts
export const DrillDownChart: React.FC<{
  data: any[];
  onDrillDown: (item: any) => void;
  renderChart: (data: any[], onItemClick: (item: any) => void) => React.ReactNode;
}> = ({ data, onDrillDown, renderChart }) => {
  return (
    <div className="relative">
      {renderChart(data, onDrillDown)}
    </div>
  );
};