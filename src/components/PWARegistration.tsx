"use client";

import { useEffect, useState } from "react";

export default function PWARegistration() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only run browser-specific code on client side
    if (typeof window !== 'undefined') {
      const handler = (e: any) => {
        e.preventDefault();
        setSupportsPWA(true);
        setPromptInstall(e);
      };

      window.addEventListener("beforeinstallprompt", handler);

      // Check if app is already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }

      // Listen for app installed event
      window.addEventListener('appinstalled', () => {
        setIsInstalled(true);
        setPromptInstall(null);
      });

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener("beforeinstallprompt", handler);
        }
      };
    }
  }, []);

  const onClick = (evt: any) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    try {
      promptInstall.prompt();
    } catch (error) {
      console.error('Failed to prompt install:', error);
    }
  };

  const registerServiceWorker = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          try {
            await Notification.requestPermission();
          } catch (error) {
            console.error('Notification permission request failed:', error);
          }
        }
        
        // Register for background sync
        if ('SyncManager' in window) {
          try {
            const registration = await navigator.serviceWorker.ready;
            // Background sync can be registered here when needed
          } catch (error) {
            console.error('Background sync registration failed:', error);
          }
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  useEffect(() => {
    if (mounted) {
      registerServiceWorker();
    }
  }, [mounted]);

  // Don't render anything during SSR or if installed/no PWA support
  if (!mounted || isInstalled || !supportsPWA) {
    return null;
  }

  return (
    <button
      className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center gap-2"
      onClick={onClick}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
      </svg>
      Install App
    </button>
  );
}