'use client';

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  UAE_CITIES,
  POPULAR_LOCATIONS,
  UAEEmirate
} from '@/types/store';
import {
  MapPin,
  Building2,
  Store,
  ShoppingBag,
  Navigation,
  Map,
  Star
} from 'lucide-react';

interface UAELocationSelectorProps {
  selectedEmirate?: UAEEmirate;
  selectedCity?: string;
  selectedLocation?: string;
  onEmirateChange: (emirate: UAEEmirate) => void;
  onCityChange: (city: string) => void;
  onLocationSelect?: (location: any) => void;
  showPopularLocations?: boolean;
  showCoordinates?: boolean;
  disabled?: boolean;
}

interface LocationInfo {
  name: string;
  description: string;
  type: 'mall' | 'souk' | 'outdoor' | 'commercial';
  popularity: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  features: string[];
  footfall: 'high' | 'medium' | 'low';
  demographics: string[];
}

// Extended location data with business intelligence
const LOCATION_DETAILS: Record<string, LocationInfo> = {
  'The Dubai Mall': {
    name: 'The Dubai Mall',
    description: 'World\'s largest shopping mall by total area, premium location',
    type: 'mall',
    popularity: 95,
    coordinates: { lat: 25.1972, lng: 55.2796 },
    features: ['Premium brands', 'High footfall', 'Tourist destination', 'Luxury shopping'],
    footfall: 'high',
    demographics: ['Tourists', 'High-income locals', 'Expatriates', 'Business travelers']
  },
  'Mall of the Emirates': {
    name: 'Mall of the Emirates',
    description: 'Premium shopping destination with Ski Dubai attraction',
    type: 'mall',
    popularity: 88,
    coordinates: { lat: 25.1175, lng: 55.2003 },
    features: ['Ski Dubai', 'Premium brands', 'Entertainment', 'Dining'],
    footfall: 'high',
    demographics: ['Families', 'Young professionals', 'Tourists', 'Locals']
  },
  'Dubai Festival City Mall': {
    name: 'Dubai Festival City Mall',
    description: 'Large shopping and entertainment complex',
    type: 'mall',
    popularity: 75,
    coordinates: { lat: 25.2221, lng: 55.3532 },
    features: ['Entertainment', 'Dining', 'Cinema', 'Festival Bay'],
    footfall: 'medium',
    demographics: ['Families', 'Residents', 'Entertainment seekers']
  },
  'Gold Souk': {
    name: 'Gold Souk',
    description: 'Traditional gold and jewelry market in Deira',
    type: 'souk',
    popularity: 85,
    coordinates: { lat: 25.2697, lng: 55.2996 },
    features: ['Traditional market', 'Gold jewelry', 'Cultural experience', 'Heritage'],
    footfall: 'high',
    demographics: ['Tourists', 'Gold buyers', 'Cultural tourists', 'Traditional shoppers']
  },
  'Perfume Souk': {
    name: 'Perfume Souk',
    description: 'Traditional perfume and fragrance market',
    type: 'souk',
    popularity: 80,
    coordinates: { lat: 25.2694, lng: 55.2995 },
    features: ['Traditional perfumes', 'Oud specialists', 'Authentic fragrances', 'Cultural experience'],
    footfall: 'medium',
    demographics: ['Perfume enthusiasts', 'Tourists', 'Traditional customers', 'Collectors']
  },
  'City Walk': {
    name: 'City Walk',
    description: 'Modern outdoor shopping and dining destination',
    type: 'outdoor',
    popularity: 82,
    coordinates: { lat: 25.2084, lng: 55.2719 },
    features: ['Outdoor shopping', 'Restaurants', 'Art installations', 'Events'],
    footfall: 'medium',
    demographics: ['Young professionals', 'Art enthusiasts', 'Dining lovers', 'Families']
  },
  'Yas Mall': {
    name: 'Yas Mall',
    description: 'Abu Dhabi\'s premier shopping destination',
    type: 'mall',
    popularity: 87,
    coordinates: { lat: 24.4883, lng: 54.6088 },
    features: ['Entertainment', 'Ferrari World nearby', 'Premium brands', 'Family entertainment'],
    footfall: 'high',
    demographics: ['Families', 'Tourists', 'Theme park visitors', 'Locals']
  },
  'Marina Mall': {
    name: 'Marina Mall',
    description: 'Waterfront shopping mall in Abu Dhabi',
    type: 'mall',
    popularity: 78,
    coordinates: { lat: 24.4817, lng: 54.3201 },
    features: ['Waterfront location', 'Marina views', 'Dining', 'Entertainment'],
    footfall: 'medium',
    demographics: ['Marina residents', 'Families', 'Waterfront lovers', 'Locals']
  },
  'City Centre Sharjah': {
    name: 'City Centre Sharjah',
    description: 'Major shopping center in Sharjah',
    type: 'mall',
    popularity: 72,
    coordinates: { lat: 25.3351, lng: 55.3890 },
    features: ['Family entertainment', 'Cinema', 'Hypermarket', 'Restaurants'],
    footfall: 'medium',
    demographics: ['Sharjah residents', 'Families', 'Value shoppers', 'Students']
  }
};

export default function UAELocationSelector({
  selectedEmirate,
  selectedCity,
  selectedLocation,
  onEmirateChange,
  onCityChange,
  onLocationSelect,
  showPopularLocations = true,
  showCoordinates = false,
  disabled = false
}: UAELocationSelectorProps) {
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [popularLocations, setPopularLocations] = useState<any[]>([]);
  const [selectedLocationInfo, setSelectedLocationInfo] = useState<LocationInfo | null>(null);

  useEffect(() => {
    if (selectedEmirate && UAE_CITIES[selectedEmirate]) {
      setAvailableCities(UAE_CITIES[selectedEmirate]);
      setPopularLocations(
        POPULAR_LOCATIONS.filter(location => location.emirate === selectedEmirate)
      );
    } else {
      setAvailableCities([]);
      setPopularLocations([]);
    }
    onCityChange(''); // Reset city when emirate changes
  }, [selectedEmirate, onCityChange]);

  const handleLocationSelect = (location: any) => {
    const locationInfo = LOCATION_DETAILS[location.name];
    setSelectedLocationInfo(locationInfo);
    onCityChange(location.city);
    onLocationSelect?.(location);
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'mall':
        return <Building2 className="h-4 w-4" />;
      case 'souk':
        return <Store className="h-4 w-4" />;
      case 'outdoor':
        return <ShoppingBag className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-600';
    if (popularity >= 80) return 'text-blue-600';
    if (popularity >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getFootfallColor = (footfall: string) => {
    switch (footfall) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Emirate Selection */}
      <div>
        <label className="text-sm font-medium mb-2 block">Emirate</label>
        <Select
          value={selectedEmirate}
          onValueChange={(value) => onEmirateChange(value as UAEEmirate)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Emirate" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(UAEEmirate).map((emirate) => (
              <SelectItem key={emirate} value={emirate}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {emirate.replace('_', ' ')}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Selection */}
      {selectedEmirate && (
        <div>
          <label className="text-sm font-medium mb-2 block">City/Area</label>
          <Select
            value={selectedCity}
            onValueChange={onCityChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Popular Locations */}
      {showPopularLocations && popularLocations.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">
            Popular Locations in {selectedEmirate?.replace('_', ' ')}
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            {popularLocations.map((location, index) => {
              const locationInfo = LOCATION_DETAILS[location.name];
              return (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedLocation === location.name ? 'ring-2 ring-primary' : ''
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !disabled && handleLocationSelect(location)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getLocationIcon(location.type)}
                        <span className="font-medium text-sm">{location.name}</span>
                      </div>
                      {locationInfo && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className={`text-xs font-medium ${getPopularityColor(locationInfo.popularity)}`}>
                            {locationInfo.popularity}
                          </span>
                        </div>
                      )}
                    </div>

                    {locationInfo && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {locationInfo.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getFootfallColor(locationInfo.footfall)}
                          >
                            {locationInfo.footfall} footfall
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {location.type}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {showCoordinates && location.coordinates && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Navigation className="h-3 w-3" />
                        <span>{location.coordinates.lat}, {location.coordinates.lng}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Location Details */}
      {selectedLocationInfo && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Map className="mr-2 h-4 w-4" />
              View Location Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getLocationIcon(selectedLocationInfo.type)}
                {selectedLocationInfo.name}
              </DialogTitle>
              <DialogDescription>
                {selectedLocationInfo.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Popularity Score</label>
                  <div className={`text-2xl font-bold ${getPopularityColor(selectedLocationInfo.popularity)}`}>
                    {selectedLocationInfo.popularity}/100
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Footfall</label>
                  <div>
                    <Badge className={getFootfallColor(selectedLocationInfo.footfall)}>
                      {selectedLocationInfo.footfall}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Key Features</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedLocationInfo.features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Target Demographics</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedLocationInfo.demographics.map((demo, index) => (
                    <Badge key={index} variant="secondary">
                      {demo}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedLocationInfo.coordinates && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">
                      {selectedLocationInfo.coordinates.lat}, {selectedLocationInfo.coordinates.lng}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = `https://maps.google.com/?q=${selectedLocationInfo.coordinates?.lat},${selectedLocationInfo.coordinates?.lng}`;
                        window.open(url, '_blank');
                      }}
                    >
                      Open in Maps
                    </Button>
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Business Insights</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedLocationInfo.footfall === 'high' && (
                    <li>• High customer traffic - ideal for premium products</li>
                  )}
                  {selectedLocationInfo.type === 'mall' && (
                    <li>• Modern shopping environment with controlled climate</li>
                  )}
                  {selectedLocationInfo.type === 'souk' && (
                    <li>• Traditional market atmosphere - authentic shopping experience</li>
                  )}
                  {selectedLocationInfo.demographics.includes('Tourists') && (
                    <li>• High tourist traffic - opportunity for cultural products</li>
                  )}
                  {selectedLocationInfo.demographics.includes('High-income locals') && (
                    <li>• Premium customer base - suitable for luxury items</li>
                  )}
                  {selectedLocationInfo.features.includes('Premium brands') && (
                    <li>• Located among premium retailers - brand positioning opportunity</li>
                  )}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Quick Stats */}
      {selectedEmirate && (
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold">{availableCities.length}</div>
            <div className="text-xs text-muted-foreground">Cities Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{popularLocations.length}</div>
            <div className="text-xs text-muted-foreground">Popular Locations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {popularLocations.filter(loc => LOCATION_DETAILS[loc.name]?.footfall === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">High Traffic Areas</div>
          </div>
        </div>
      )}
    </div>
  );
}