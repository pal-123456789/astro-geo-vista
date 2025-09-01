import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Bell, 
  Cloud, 
  Zap,
  RefreshCw,
  X,
  Info
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'weather' | 'space' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  dismissed?: boolean;
}

export const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock alerts data - in production, this would come from your backend
  const generateMockAlerts = (): Alert[] => [
    {
      id: '1',
      type: 'weather',
      severity: 'medium',
      title: 'Strong Wind Advisory',
      description: 'Wind speeds may reach 15-20 m/s in your area',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      id: '2',
      type: 'space',
      severity: 'low',
      title: 'Solar Flare Activity',
      description: 'Minor solar flare detected, may affect satellite communications',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '3',
      type: 'space',
      severity: 'high',
      title: 'Near Earth Object',
      description: 'Asteroid 2024 AB approaching Earth - closest approach tomorrow',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: '4',
      type: 'system',
      severity: 'low',
      title: 'Data Sync Complete',
      description: 'Latest weather and space data synchronized successfully',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setAlerts(generateMockAlerts());
  }, []);

  const refreshAlerts = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAlerts(generateMockAlerts());
    setLoading(false);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityVariant = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'weather': return <Cloud className="w-4 h-4" />;
      case 'space': return <Zap className="w-4 h-4" />;
      case 'system': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      return `${hours}h ago`;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  const criticalCount = activeAlerts.filter(alert => alert.severity === 'critical').length;
  const highCount = activeAlerts.filter(alert => alert.severity === 'high').length;

  return (
    <Card className="glass cosmic-glow animate-float h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-space-orange" />
            System Alerts
            {(criticalCount > 0 || highCount > 0) && (
              <Badge variant="destructive" className="ml-2">
                {criticalCount + highCount}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshAlerts}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="p-6 pt-0 space-y-3">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">No active alerts</p>
                <p className="text-xs text-muted-foreground">All systems operating normally</p>
              </div>
            ) : (
              activeAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-card/50 rounded-lg border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={getSeverityColor(alert.severity)}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium truncate">
                            {alert.title}
                          </h4>
                          <Badge 
                            variant={getSeverityVariant(alert.severity)}
                            className="text-xs"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {alert.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(alert.timestamp)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};