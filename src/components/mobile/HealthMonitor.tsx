import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Satellite
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  threshold: { min: number; max: number };
}

interface EnvironmentalAlert {
  id: string;
  type: 'air_quality' | 'uv_index' | 'pollen' | 'radiation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
}

const HealthMonitor = () => {
  const [currentLocation, setCurrentLocation] = useState('San Francisco, CA');
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: 'aqi',
      name: 'Air Quality Index',
      value: 85,
      unit: 'AQI',
      status: 'warning',
      trend: 'up',
      icon: <Wind className="w-5 h-5" />,
      threshold: { min: 0, max: 100 }
    },
    {
      id: 'uv',
      name: 'UV Index',
      value: 7,
      unit: 'UV',
      status: 'danger',
      trend: 'stable',
      icon: <Thermometer className="w-5 h-5" />,
      threshold: { min: 0, max: 11 }
    },
    {
      id: 'humidity',
      name: 'Humidity',
      value: 65,
      unit: '%',
      status: 'normal',
      trend: 'down',
      icon: <Droplets className="w-5 h-5" />,
      threshold: { min: 30, max: 70 }
    },
    {
      id: 'radiation',
      name: 'Radiation Level',
      value: 0.12,
      unit: 'μSv/h',
      status: 'normal',
      trend: 'stable',
      icon: <Satellite className="w-5 h-5" />,
      threshold: { min: 0, max: 1 }
    }
  ]);

  const [environmentalAlerts, setEnvironmentalAlerts] = useState<EnvironmentalAlert[]>([
    {
      id: '1',
      type: 'air_quality',
      severity: 'high',
      title: 'Poor Air Quality Alert',
      description: 'Particulate matter levels are elevated due to wildfire smoke',
      location: 'San Francisco Bay Area',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'uv_index',
      severity: 'critical',
      title: 'Extreme UV Warning',
      description: 'UV index reaching dangerous levels, avoid prolonged sun exposure',
      location: 'Current Location',
      timestamp: new Date()
    }
  ]);

  const [healthTrend] = useState([
    { time: '00:00', aqi: 45, uv: 0, humidity: 70 },
    { time: '06:00', aqi: 55, uv: 2, humidity: 68 },
    { time: '12:00', aqi: 85, uv: 7, humidity: 65 },
    { time: '18:00', aqi: 75, uv: 4, humidity: 63 },
    { time: '23:59', aqi: 65, uv: 0, humidity: 66 }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gradient">Health Monitor</h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{currentLocation}</span>
          </div>
        </div>
        <Badge variant="secondary" className="animate-pulse-glow">
          <Heart className="w-4 h-4 mr-2" />
          Live
        </Badge>
      </motion.div>

      {/* Environmental Alerts */}
      {environmentalAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Active Alerts
          </h2>
          {environmentalAlerts.map((alert) => (
            <Card key={alert.id} className="p-4 border-l-4 border-orange-500">
              <div className="flex items-start justify-between mb-2">
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <h3 className="font-semibold mb-1">{alert.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {alert.location}
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Health Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        {healthMetrics.map((metric) => (
          <Card key={metric.id} className="p-4 glass">
            <div className="flex items-center justify-between mb-3">
              <div className={getStatusColor(metric.status)}>
                {metric.icon}
              </div>
              {getTrendIcon(metric.trend)}
            </div>
            
            <div className="mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {metric.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{metric.value}</span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
            </div>

            <Progress 
              value={(metric.value / metric.threshold.max) * 100} 
              className="h-2"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{metric.threshold.min}</span>
              <span>{metric.threshold.max}</span>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Health Trend Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">24-Hour Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrend}>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        <Button variant="outline" className="h-16 flex-col gap-2">
          <Satellite className="w-5 h-5" />
          <span className="text-sm">Refresh Data</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <MapPin className="w-5 h-5" />
          <span className="text-sm">Change Location</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default HealthMonitor;