import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileNavigation from '@/components/mobile/MobileNavigation';
import Globe3D from '@/components/mobile/Globe3D';
import HealthMonitor from '@/components/mobile/HealthMonitor';
import SpaceDashboard from '@/components/dashboard/SpaceDashboard';
import AnomalyDashboard from '@/components/anomaly/AnomalyDashboard';
import { usePushNotifications } from '@/components/mobile/PushNotifications';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  BellOff, 
  Smartphone, 
  Satellite,
  MapPin,
  Heart,
  Activity,
  Globe2,
  Settings as SettingsIcon
} from 'lucide-react';

const MobileApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Add error boundary for push notifications
  let pushNotifications;
  try {
    pushNotifications = usePushNotifications();
  } catch (error) {
    console.log('Push notifications not available:', error);
    pushNotifications = { isRegistered: false, sendTestNotification: () => {}, scheduleHealthReminder: () => {} };
  }
  
  const { isRegistered, sendTestNotification, scheduleHealthReminder } = pushNotifications;

  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'dashboard':
          return <SpaceDashboard />;
        case 'globe':
          return (
            <div className="h-screen w-full bg-gradient-to-br from-space-blue/10 via-background to-space-purple/10">
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="p-4 bg-primary/20 rounded-full"
                >
                  <Globe2 className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-lg font-medium">3D Globe</p>
                <p className="text-muted-foreground">Interactive Earth Visualization</p>
              </div>
            </div>
          );
        case 'health':
          return <HealthMonitor />;
        case 'alerts':
          return <AnomalyDashboard />;
        case 'settings':
        return (
          <div className="p-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-bold text-gradient mb-6">Settings</h1>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={isRegistered ? 'secondary' : 'destructive'}>
                        {isRegistered ? 'Connected' : 'Offline'}
                      </Badge>
                      <span className="text-sm">Push Notifications</span>
                    </div>
                    <Switch 
                      checked={notificationsEnabled} 
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={sendTestNotification}
                      className="text-xs"
                    >
                      Test Alert
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={scheduleHealthReminder}
                      className="text-xs"
                    >
                      Health Reminders
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* App Information */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  App Information
                </h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Build</span>
                    <span>2025.01.001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Sources</span>
                    <Badge variant="secondary" className="text-xs">
                      <Satellite className="w-3 h-3 mr-1" />
                      NASA
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Features Overview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Features</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Satellite className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium">Real-time Data</div>
                      <div className="text-xs text-muted-foreground">NASA API</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Heart className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="text-sm font-medium">Health Monitor</div>
                      <div className="text-xs text-muted-foreground">Environmental</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Activity className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">AI Detection</div>
                      <div className="text-xs text-muted-foreground">Anomalies</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium">3D Globe</div>
                      <div className="text-xs text-muted-foreground">Interactive</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        );
        default:
          return <SpaceDashboard />;
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">TerraPulse</h2>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
      
      <MobileNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default MobileApp;