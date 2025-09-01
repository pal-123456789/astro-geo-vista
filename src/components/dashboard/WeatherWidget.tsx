import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CloudRain, 
  Thermometer, 
  Wind, 
  Eye, 
  Droplets,
  Sun,
  Moon,
  Cloud,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { weatherApi, locationService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  icon: string;
  feels_like: number;
}

interface WeatherWidgetProps {
  expanded?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ expanded = false }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const position = await locationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const [currentWeather, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(latitude, longitude),
        weatherApi.getWeatherForecast(latitude, longitude)
      ]);

      setWeatherData({
        location: currentWeather.name,
        temperature: Math.round(currentWeather.main.temp),
        description: currentWeather.weather[0].description,
        humidity: currentWeather.main.humidity,
        windSpeed: currentWeather.wind.speed,
        visibility: currentWeather.visibility / 1000,
        pressure: currentWeather.main.pressure,
        icon: currentWeather.weather[0].icon,
        feels_like: Math.round(currentWeather.main.feels_like)
      });

      // Process forecast data (next 5 days)
      const processedForecast = forecastData.list
        .filter((_: any, index: number) => index % 8 === 0) // Every 8th item (24 hours)
        .slice(0, 5)
        .map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon
        }));

      setForecast(processedForecast);
    } catch (error) {
      console.error('Weather fetch error:', error);
      toast({
        title: "Weather Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="w-6 h-6 text-space-orange" />;
    if (iconCode.includes('02') || iconCode.includes('03')) return <Cloud className="w-6 h-6 text-muted-foreground" />;
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="w-6 h-6 text-space-blue" />;
    if (iconCode.includes('n')) return <Moon className="w-6 h-6 text-space-purple" />;
    return <Sun className="w-6 h-6 text-space-orange" />;
  };

  if (loading) {
    return (
      <Card className="glass cosmic-glow animate-float">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Unable to load weather data</p>
            <Button onClick={fetchWeatherData} className="mt-4" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass cosmic-glow animate-float">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-space-blue" />
            Weather Monitor
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchWeatherData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weatherData.icon)}
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{weatherData.location}</span>
              </div>
              <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
              <p className="text-sm text-muted-foreground capitalize">
                {weatherData.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Feels like</p>
            <p className="text-xl font-semibold">{weatherData.feels_like}°C</p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-space-blue" />
            <span className="text-sm">Humidity: {weatherData.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-space-cyan" />
            <span className="text-sm">Wind: {weatherData.windSpeed} m/s</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-space-green" />
            <span className="text-sm">Visibility: {weatherData.visibility} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-space-orange" />
            <span className="text-sm">Pressure: {weatherData.pressure} hPa</span>
          </div>
        </div>

        {/* Forecast (if expanded) */}
        {expanded && forecast.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">5-Day Forecast</h4>
            <div className="grid grid-cols-5 gap-2">
              {forecast.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-2 rounded-lg bg-card/50"
                >
                  <p className="text-xs text-muted-foreground">{day.date}</p>
                  <div className="flex justify-center my-1">
                    {getWeatherIcon(day.icon)}
                  </div>
                  <p className="text-sm font-semibold">{day.temperature}°</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <Badge variant="secondary" className="w-fit">
          <RefreshCw className="w-3 h-3 mr-1" />
          Live Data
        </Badge>
      </CardContent>
    </Card>
  );
};