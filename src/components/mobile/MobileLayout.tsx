import { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const setupMobile = async () => {
      try {
        const info = await Device.getInfo();
        setDeviceInfo(info);
        setIsNative(info.platform !== 'web');

        if (info.platform !== 'web') {
          // Set up native app styling
          console.log('Running in native mode');
        }
      } catch (error) {
        console.log('Running in web mode');
      }
    };

    setupMobile();
  }, []);

  const handleHapticFeedback = async () => {
    if (isNative) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'min-h-screen w-full bg-background',
        isNative && 'pt-safe-area-inset-top pb-safe-area-inset-bottom',
        className
      )}
      onTouchStart={handleHapticFeedback}
    >
      {children}
    </motion.div>
  );
};