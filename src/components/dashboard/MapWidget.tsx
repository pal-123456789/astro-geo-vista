import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Layers, 
  Satellite,
  RefreshCw,
  Maximize2,
  Navigation
} from 'lucide-react';
import { locationService, geocodingApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface MapWidgetProps {
  expanded?: boolean;
}

export const MapWidget: React.FC<MapWidgetProps> = ({ expanded = false }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const initializeMap = async () => {
    try {
      setLoading(true);
      
      // Get current position
      const position = await locationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      setCoordinates({ lat: latitude, lng: longitude });

      // Get location name
      const geoData = await geocodingApi.reverseGeocode(latitude, longitude);
      const locationName = geoData.results[0]?.formatted || 'Current Location';
      setCurrentLocation(locationName);

      // Initialize Mapbox (placeholder - requires actual Mapbox integration)
      if (mapContainer.current) {
        // For now, we'll show a placeholder map
        // In a real implementation, you'd initialize Mapbox GL JS here
        mapContainer.current.innerHTML = `
          <div class="w-full h-full bg-gradient-to-br from-space-blue/20 to-space-purple/20 rounded-lg flex items-center justify-center">
            <div class="text-center space-y-2">
              <div class="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <MapPin class="w-8 h-8 text-primary" />
              </div>
              <p class="text-sm font-medium">Interactive Map</p>
              <p class="text-xs text-muted-foreground">${locationName}</p>
              <p class="text-xs text-muted-foreground">${latitude.toFixed(4)}, ${longitude.toFixed(4)}</p>
            </div>
          </div>
        `;
      }
    } catch (error) {
      console.error('Map initialization error:', error);
      toast({
        title: "Map Error",
        description: "Failed to initialize map. Please check location permissions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeMap();
  }, []);

  const handleRefresh = () => {
    initializeMap();
  };

  const handleGetCurrentLocation = async () => {
    try {
      const position = await locationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      setCoordinates({ lat: latitude, lng: longitude });
      
      // Update location name
      const geoData = await geocodingApi.reverseGeocode(latitude, longitude);
      const locationName = geoData.results[0]?.formatted || 'Current Location';
      setCurrentLocation(locationName);

      toast({
        title: "Location Updated",
        description: `Current location: ${locationName}`
      });
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Failed to get current location. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="glass cosmic-glow animate-float">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-space-green" />
            Interactive Map
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGetCurrentLocation}
            >
              <Navigation className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{currentLocation}</p>
            {coordinates && (
              <p className="text-xs text-muted-foreground">
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </p>
            )}
          </div>
          <Badge variant="secondary">
            <Satellite className="w-3 h-3 mr-1" />
            Live GPS
          </Badge>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div 
            ref={mapContainer}
            className={`rounded-lg border ${expanded ? 'h-96' : 'h-48'} transition-all duration-300`}
          />
          
          {loading && (
            <div className="absolute inset-0 bg-card/80 rounded-lg flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-6 h-6 text-primary" />
              </motion.div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Layers className="w-4 h-4 mr-2" />
              Layers
            </Button>
            <Button variant="outline" size="sm">
              <Satellite className="w-4 h-4 mr-2" />
              Satellite
            </Button>
          </div>
          
          {!expanded && (
            <Button variant="outline" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Map Features (if expanded) */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card/50 rounded-lg text-center">
                <p className="text-sm font-medium">Weather Layer</p>
                <p className="text-xs text-muted-foreground">Temperature & Precipitation</p>
              </div>
              <div className="p-3 bg-card/50 rounded-lg text-center">
                <p className="text-sm font-medium">Satellite View</p>
                <p className="text-xs text-muted-foreground">Real-time Earth imagery</p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};