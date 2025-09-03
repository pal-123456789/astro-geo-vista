import { useEffect, useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Device } from '@capacitor/device';
import { useToast } from '@/hooks/use-toast';

export const usePushNotifications = () => {
  const [token, setToken] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const setupPushNotifications = async () => {
      try {
        const info = await Device.getInfo();
        
        if (info.platform === 'web') {
          console.log('Push notifications not available on web');
          return;
        }

        // Request permission
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
          throw new Error('User denied permissions!');
        }

        // Register for push notifications
        await PushNotifications.register();

        // On registration
        PushNotifications.addListener('registration', (token) => {
          console.log('Push registration success, token: ', token.value);
          setToken(token.value);
          setIsRegistered(true);
        });

        // On registration error
        PushNotifications.addListener('registrationError', (error) => {
          console.error('Error on registration: ', error);
          toast({
            title: 'Push Notification Error',
            description: 'Failed to register for push notifications',
            variant: 'destructive'
          });
        });

        // Handle push notification received
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push received: ', notification);
          
          // Show local notification if app is in foreground
          LocalNotifications.schedule({
            notifications: [
              {
                title: notification.title || 'TerraPulse Alert',
                body: notification.body || 'New environmental alert',
                id: Date.now(),
                schedule: { at: new Date(Date.now() + 1000) },
                sound: 'beep.wav',
                attachments: notification.data?.imageUrl ? [
                  {
                    id: 'image',
                    url: notification.data.imageUrl,
                    options: {
                      iosUNNotificationAttachmentOptionsTypeHintKey: 'public.jpeg'
                    }
                  }
                ] : undefined,
                actionTypeId: 'ALERT_ACTION',
                extra: notification.data
              }
            ]
          });
        });

        // Handle notification tap
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Push action performed: ', action);
          
          // Handle different notification actions
          if (action.notification.data?.type === 'anomaly') {
            // Navigate to anomaly details
            window.location.hash = `/anomaly/${action.notification.data.anomalyId}`;
          } else if (action.notification.data?.type === 'health_alert') {
            // Navigate to health monitor
            window.location.hash = '/health';
          }
        });

        // Setup local notification categories
        await LocalNotifications.registerActionTypes({
          types: [
            {
              id: 'ALERT_ACTION',
              actions: [
                {
                  id: 'view',
                  title: 'View Details',
                  foreground: true
                },
                {
                  id: 'dismiss',
                  title: 'Dismiss',
                  destructive: true
                }
              ]
            }
          ]
        });

      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };

    setupPushNotifications();

    return () => {
      PushNotifications.removeAllListeners();
      LocalNotifications.removeAllListeners();
    };
  }, [toast]);

  const sendTestNotification = async () => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'TerraPulse Alert',
            body: 'Critical environmental anomaly detected in your area',
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) },
            sound: 'beep.wav',
            actionTypeId: 'ALERT_ACTION',
            extra: {
              type: 'anomaly',
              anomalyId: 'test-123',
              severity: 'critical'
            }
          }
        ]
      });

      toast({
        title: 'Test Notification Sent',
        description: 'Check your notification panel'
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test notification',
        variant: 'destructive'
      });
    }
  };

  const scheduleHealthReminder = async () => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Health Check Reminder',
            body: 'Time to check your environmental health metrics',
            id: Date.now(),
            schedule: { 
              repeats: true,
              every: 'hour'
            },
            sound: 'beep.wav',
            actionTypeId: 'ALERT_ACTION',
            extra: {
              type: 'health_reminder'
            }
          }
        ]
      });

      toast({
        title: 'Health Reminders Enabled',
        description: 'You will receive hourly health check reminders'
      });
    } catch (error) {
      console.error('Error scheduling health reminder:', error);
    }
  };

  return {
    token,
    isRegistered,
    sendTestNotification,
    scheduleHealthReminder
  };
};