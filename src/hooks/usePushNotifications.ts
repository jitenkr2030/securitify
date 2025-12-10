"use client";

import { useState, useEffect, useCallback } from 'react';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

interface NotificationOptions {
  vapidPublicKey?: string;
  serviceWorkerPath?: string;
  requestPermission?: boolean;
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface PushSubscriptionAPI {
  endpoint: string;
  getKey: (name: 'p256dh' | 'auth') => ArrayBuffer | null;
  unsubscribe: () => Promise<boolean>;
}

export function usePushNotifications(options: NotificationOptions = {}) {
  const {
    vapidPublicKey = '',
    serviceWorkerPath = '/sw.js',
    requestPermission = true
  } = options;

  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [browserSubscription, setBrowserSubscription] = useState<PushSubscriptionAPI | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'Notification' in window && 
                       'serviceWorker' in navigator && 
                       'PushManager' in window;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
      }
    };

    checkSupport();

    // Listen for permission changes
    if (isSupported) {
      const handlePermissionChange = () => {
        setPermission(Notification.permission);
      };

      navigator.permissions.query({ name: 'notifications' as PermissionName })
        .then(permissionStatus => {
          permissionStatus.onchange = handlePermissionChange;
        });
    }
  }, [isSupported]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission === 'granted';
    } catch (error) {
      setError('Failed to request notification permission');
      return false;
    }
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!isSupported || permission !== 'granted') {
      setError('Notification permission not granted');
      return null;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register(serviceWorkerPath);
      
      // Subscribe to push
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      // Convert browser PushSubscription to our interface format
      const subscriptionData: PushSubscription = {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: pushSubscription.getKey('p256dh') ? 
                  btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(pushSubscription.getKey('p256dh')!)))) : '',
          auth: pushSubscription.getKey('auth') ? 
                btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(pushSubscription.getKey('auth')!)))) : ''
        }
      };

      setSubscription(subscriptionData);
      setBrowserSubscription(pushSubscription);
      setIsSubscribed(true);
      setError(null);
      
      return subscriptionData;
    } catch (error) {
      setError('Failed to subscribe to push notifications');
      console.error('Push subscription error:', error);
      return null;
    }
  }, [isSupported, permission, vapidPublicKey, serviceWorkerPath]);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async () => {
    if (!browserSubscription) return false;

    try {
      await browserSubscription.unsubscribe();
      setSubscription(null);
      setBrowserSubscription(null);
      setIsSubscribed(false);
      return true;
    } catch (error) {
      setError('Failed to unsubscribe from push notifications');
      return false;
    }
  }, [browserSubscription]);

  // Send notification
  const sendNotification = useCallback(async (payload: NotificationPayload) => {
    if (!isSupported || permission !== 'granted') {
      setError('Cannot send notification - permission not granted');
      return false;
    }

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon,
        badge: payload.badge,
        tag: payload.tag,
        data: payload.data
      });

      // Add to notifications list
      setNotifications(prev => [...prev, notification]);

      // Auto-close after 5 seconds if not requiring interaction
      if (!payload.requireInteraction) {
        setTimeout(() => {
          notification.close();
          setNotifications(prev => prev.filter(n => n !== notification));
        }, 5000);
      }

      return true;
    } catch (error) {
      setError('Failed to send notification');
      return false;
    }
  }, [isSupported, permission]);

  // Send notification via service worker
  const sendNotificationViaServiceWorker = useCallback(async (payload: NotificationPayload) => {
    if (!isSupported) {
      setError('Service Worker notifications not supported');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon,
        badge: payload.badge,
        tag: payload.tag,
        data: payload.data
      });

      return true;
    } catch (error) {
      setError('Failed to send notification via service worker');
      return false;
    }
  }, [isSupported]);

  // Close notification
  const closeNotification = useCallback((notification: Notification) => {
    notification.close();
    setNotifications(prev => prev.filter(n => n !== notification));
  }, []);

  // Close all notifications
  const closeAllNotifications = useCallback(() => {
    notifications.forEach(notification => notification.close());
    setNotifications([]);
  }, [notifications]);

  // Get notification permission status
  const getPermissionStatus = useCallback(() => {
    return permission;
  }, [permission]);

  // Check if notifications are enabled
  const areNotificationsEnabled = useCallback(() => {
    return isSupported && permission === 'granted' && isSubscribed;
  }, [isSupported, permission, isSubscribed]);

  // Listen for notification clicks
  useEffect(() => {
    if (!isSupported) return;

    const handleNotificationClick = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
        const { notification, action } = event.data;
        
        // Handle notification click actions
        if (action) {
          console.log(`Notification action clicked: ${action}`);
        } else {
          console.log('Notification clicked:', notification);
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleNotificationClick);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleNotificationClick);
    };
  }, [isSupported]);

  // Auto-request permission on mount if requested
  useEffect(() => {
    if (requestPermission && isSupported && permission === 'default') {
      requestNotificationPermission();
    }
  }, [requestPermission, isSupported, permission, requestNotificationPermission]);

  return {
    isSupported,
    permission,
    subscription,
    isSubscribed,
    notifications,
    error,
    requestNotificationPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendNotification,
    sendNotificationViaServiceWorker,
    closeNotification,
    closeAllNotifications,
    getPermissionStatus,
    areNotificationsEnabled
  };
}