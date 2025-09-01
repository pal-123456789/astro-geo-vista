import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Star, 
  Globe, 
  Camera,
  RefreshCw,
  ExternalLink,
  Calendar,
  Info
} from 'lucide-react';
import { nasaApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface APODData {
  title: string;
  url: string;
  explanation: string;
  date: string;
  media_type: string;
  hdurl?: string;
}

interface NASAWidgetProps {
  expanded?: boolean;
}

export const NASAWidget: React.FC<NASAWidgetProps> = ({ expanded = false }) => {
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [neoData, setNeoData] = useState<any>(null);
  const [marsPhotos, setMarsPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNASAData = async () => {
    try {
      setLoading(true);
      
      // Fetch Astronomy Picture of the Day
      const apod = await nasaApi.getAPOD();
      setApodData(apod);

      // Fetch Near Earth Objects (today to tomorrow)
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const neo = await nasaApi.getNearEarthObjects(today, tomorrow);
      setNeoData(neo);

      // Fetch Mars Rover Photos (latest)
      if (expanded) {
        const mars = await nasaApi.getMarsRoverPhotos(1000);
        setMarsPhotos(mars.photos.slice(0, 6));
      }

    } catch (error) {
      console.error('NASA data fetch error:', error);
      toast({
        title: "NASA Data Error",
        description: "Failed to fetch space data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNASAData();
  }, [expanded]);

  if (loading) {
    return (
      <Card className="glass cosmic-glow animate-float">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Rocket className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const nearEarthCount = neoData?.element_count || 0;

  return (
    <Card className="glass cosmic-glow animate-float">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-space-blue" />
            NASA Space Data
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchNASAData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Astronomy Picture of the Day */}
        {apodData && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-space-orange" />
              <h4 className="font-semibold">Picture of the Day</h4>
            </div>
            
            {apodData.media_type === 'image' && (
              <div className="relative group">
                <img 
                  src={apodData.url} 
                  alt={apodData.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button variant="secondary" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View HD
                  </Button>
                </div>
              </div>
            )}
            
            <div>
              <h5 className="font-medium">{apodData.title}</h5>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {apodData.explanation}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{apodData.date}</span>
              </div>
            </div>
          </div>
        )}

        {/* Near Earth Objects */}
        <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-space-green" />
            <span className="text-sm">Near Earth Objects</span>
          </div>
          <Badge variant="secondary">
            {nearEarthCount} detected
          </Badge>
        </div>

        {/* Mars Rover Photos (if expanded) */}
        {expanded && marsPhotos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-space-orange" />
              <h4 className="font-semibold">Latest Mars Photos</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {marsPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <img
                    src={photo.img_src}
                    alt={`Mars photo ${photo.id}`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <Badge variant="secondary" className="w-fit">
          <Star className="w-3 h-3 mr-1" />
          NASA Official Data
        </Badge>
      </CardContent>
    </Card>
  );
};