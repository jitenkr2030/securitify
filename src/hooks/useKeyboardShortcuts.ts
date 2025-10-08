"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const {
        key,
        ctrlKey = false,
        metaKey = false,
        altKey = false,
        shiftKey = false,
        callback,
        preventDefault = true
      } = shortcut;

      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatch = event.ctrlKey === ctrlKey;
      const metaMatch = event.metaKey === metaKey;
      const altMatch = event.altKey === altKey;
      const shiftMatch = event.shiftKey === shiftKey;

      if (keyMatch && ctrlMatch && metaMatch && altMatch && shiftMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && document) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown]);
}

// Hook for global search shortcut
export function useGlobalSearchShortcut(onOpen: () => void) {
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      callback: onOpen
    },
    {
      key: 'k',
      metaKey: true,
      callback: onOpen
    },
    {
      key: '/',
      callback: onOpen
    }
  ]);
}

// Hook for navigation shortcuts
export function useNavigationShortcuts() {
  useKeyboardShortcuts([
    {
      key: 'h',
      altKey: true,
      callback: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    },
    {
      key: 'd',
      altKey: true,
      callback: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
      }
    },
    {
      key: 'p',
      altKey: true,
      callback: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/pricing';
        }
      }
    },
    {
      key: 's',
      altKey: true,
      callback: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/support/help';
        }
      }
    }
  ]);
}

// Hook for accessibility shortcuts
export function useAccessibilityShortcuts() {
  useKeyboardShortcuts([
    {
      key: 'Escape',
      callback: () => {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined' && document) {
          // Close any open modals or dialogs
          const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
          document.dispatchEvent(escapeEvent);
        }
      }
    },
    {
      key: 'Tab',
      shiftKey: true,
      preventDefault: false,
      callback: () => {
        // Let default tab behavior work
      }
    }
  ]);
}