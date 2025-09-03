import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Globe, 
  Heart, 
  Bell, 
  Settings,
  Activity,
  MapPin,
  Satellite
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'globe',
      label: 'Globe',
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 'health',
      label: 'Health',
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-5 h-5" />,
      badge: 3
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t"
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navigationItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200',
              'min-h-[60px] min-w-[60px]',
              activeTab === item.id
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
            whileTap={{ scale: 0.95 }}
            layout
          >
            {/* Active indicator */}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            {/* Icon */}
            <div className="relative">
              {item.icon}
              
              {/* Badge */}
              {item.badge && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {item.badge}
                </motion.div>
              )}
            </div>

            {/* Label */}
            <span className="text-xs font-medium mt-1 leading-none">
              {item.label}
            </span>

            {/* Active dot */}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeDot"
                className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default MobileNavigation;