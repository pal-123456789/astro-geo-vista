import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Eye,
  Globe,
  Satellite,
  Zap,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface StatItem {
  id: string;
  title: string;
  value: string;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

export const StatsGrid: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in production, this would come from your various APIs
  const generateMockStats = (): StatItem[] => [
    {
      id: 'temp',
      title: 'Temperature',
      value: '23',
      unit: '°C',
      change: 2.5,
      trend: 'up',
      icon: <Thermometer className="w-5 h-5" />,
      color: 'text-space-orange'
    },
    {
      id: 'humidity',
      title: 'Humidity',
      value: '68',
      unit: '%',
      change: -1.2,
      trend: 'down',
      icon: <Droplets className="w-5 h-5" />,
      color: 'text-space-blue'
    },
    {
      id: 'wind',
      title: 'Wind Speed',
      value: '12',
      unit: 'm/s',
      change: 0.8,
      trend: 'up',
      icon: <Wind className="w-5 h-5" />,
      color: 'text-space-cyan'
    },
    {
      id: 'visibility',
      title: 'Visibility',
      value: '15',
      unit: 'km',
      change: 0,
      trend: 'stable',
      icon: <Eye className="w-5 h-5" />,
      color: 'text-space-green'
    },
    {
      id: 'neo',
      title: 'Near Earth Objects',
      value: '8',
      unit: 'detected',
      change: 2,
      trend: 'up',
      icon: <Globe className="w-5 h-5" />,
      color: 'text-space-purple'
    },
    {
      id: 'satellites',
      title: 'Active Satellites',
      value: '4,852',
      unit: 'online',
      change: 12,
      trend: 'up',
      icon: <Satellite className="w-5 h-5" />,
      color: 'text-space-blue'
    },
    {
      id: 'solar',
      title: 'Solar Activity',
      value: 'Low',
      unit: 'level',
      change: 0,
      trend: 'stable',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-space-orange'
    },
    {
      id: 'data',
      title: 'Data Accuracy',
      value: '99.7',
      unit: '%',
      change: 0.2,
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-space-green'
    }
  ];

  useEffect(() => {
    // Simulate loading and data fetch
    const timer = setTimeout(() => {
      setStats(generateMockStats());
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend: StatItem['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      default: return <div className="w-3 h-3 rounded-full bg-gray-500" />;
    }
  };

  const getTrendColor = (trend: StatItem['trend']) => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="glass animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-muted/20 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass hover:cosmic-glow transition-all duration-300 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
                {stat.change !== 0 && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(stat.trend)}
                    <span className={`text-xs ${getTrendColor(stat.trend)}`}>
                      {Math.abs(stat.change)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.unit}</span>
                </div>
              </div>

              {stat.trend === 'up' && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  Rising
                </Badge>
              )}
              {stat.trend === 'down' && (
                <Badge variant="outline" className="mt-2 text-xs">
                  Falling
                </Badge>
              )}
              {stat.trend === 'stable' && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  Stable
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};