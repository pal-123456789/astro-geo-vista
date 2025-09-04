import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Satellite, 
  Globe, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Eye,
  Rocket,
  Star,
  MapPin
} from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { NASAWidget } from './NASAWidget';
import { MapWidget } from './MapWidget';
import { AlertsPanel } from './AlertsPanel';
import { StatsGrid } from './StatsGrid';

const SpaceDashboard = () => {
  try {
    return (
      <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gradient">
            Space & Weather Monitor
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time Earth observation and space monitoring system
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="animate-pulse-glow">
            <Satellite className="w-4 h-4 mr-2" />
            Live Data
          </Badge>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="weather" className="flex items-center gap-2">
            <CloudRain className="w-4 h-4" />
            Weather
          </TabsTrigger>
          <TabsTrigger value="space" className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Space
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weather Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <WeatherWidget />
            </motion.div>

            {/* Alerts Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AlertsPanel />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NASA Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <NASAWidget />
            </motion.div>

            {/* Map Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <MapWidget />
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="weather">
          <WeatherWidget expanded />
        </TabsContent>

        <TabsContent value="space">
          <NASAWidget expanded />
        </TabsContent>

        <TabsContent value="map">
          <MapWidget expanded />
        </TabsContent>
      </Tabs>
      </div>
    );
  } catch (error) {
    console.error('SpaceDashboard error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gradient">TerraPulse</h1>
          <p className="text-muted-foreground">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }
};

export default SpaceDashboard;