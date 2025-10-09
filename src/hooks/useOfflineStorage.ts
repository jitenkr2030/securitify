"use client";

import { useState, useEffect, useCallback } from 'react';

interface OfflineStorageOptions {
  dbName?: string;
  storeName?: string;
  version?: number;
}

interface OfflineOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: string;
  data: any;
  timestamp: string;
  synced: boolean;
}

export function useOfflineStorage<T = any>(options: OfflineStorageOptions = {}) {
  const {
    dbName = 'securityGuardDB',
    storeName = 'dataStore',
    version = 1
  } = options;

  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingOperations, setPendingOperations] = useState<OfflineOperation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize IndexedDB
  const initDB = useCallback(async () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(storeName)) {
          const objectStore = db.createObjectStore(storeName, { keyPath: 'id' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('collection', 'collection', { unique: false });
        }

        // Create operations store for pending sync operations
        if (!db.objectStoreNames.contains('operations')) {
          const operationsStore = db.createObjectStore('operations', { keyPath: 'id' });
          operationsStore.createIndex('timestamp', 'timestamp', { unique: false });
          operationsStore.createIndex('synced', 'synced', { unique: false });
        }
      };
    });
  }, [dbName, storeName, version]);

  // Initialize database on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const database = await initDB();
        setDb(database);
        await loadPendingOperations();
      } catch (error) {
        console.error('Failed to initialize offline storage:', error);
      }
    };

    initialize();

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [initDB]);

  // Load pending operations
  const loadPendingOperations = useCallback(async () => {
    if (!db) return;

    try {
      const transaction = db.transaction(['operations'], 'readonly');
      const store = transaction.objectStore('operations');
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(false));

      request.onsuccess = () => {
        setPendingOperations(request.result);
      };

      request.onerror = () => {
        console.error('Failed to load pending operations:', request.error);
      };
    } catch (error) {
      console.error('Error loading pending operations:', error);
    }
  }, [db]);

  // Save data offline
  const saveOffline = useCallback(async (collection: string, data: T) => {
    if (!db) {
      console.error('Database not initialized');
      return false;
    }

    try {
      const transaction = db.transaction([storeName, 'operations'], 'readwrite');
      const dataStore = transaction.objectStore(storeName);
      const operationsStore = transaction.objectStore('operations');

      // Save data
      const saveRequest = dataStore.put({
        ...data,
        collection,
        timestamp: new Date().toISOString()
      });

      // Create operation for sync
      const operation: OfflineOperation = {
        id: `op_${Date.now()}_${Math.random()}`,
        type: 'create',
        collection,
        data,
        timestamp: new Date().toISOString(),
        synced: false
      };

      const operationRequest = operationsStore.add(operation);

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      setPendingOperations(prev => [...prev, operation]);
      return true;
    } catch (error) {
      console.error('Failed to save data offline:', error);
      return false;
    }
  }, [db, storeName]);

  // Get data from offline storage
  const getOffline = useCallback(async (collection: string, id?: string): Promise<T[]> => {
    if (!db) return [];

    try {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      if (id) {
        const request = store.get(id);
        return new Promise((resolve) => {
          request.onsuccess = () => {
            const result = request.result;
            resolve(result && result.collection === collection ? [result] : []);
          };
          request.onerror = () => resolve([]);
        });
      } else {
        const index = store.index('collection');
        const request = index.getAll(collection);
        return new Promise((resolve) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve([]);
        });
      }
    } catch (error) {
      console.error('Failed to get data from offline storage:', error);
      return [];
    }
  }, [db, storeName]);

  // Update data offline
  const updateOffline = useCallback(async (collection: string, id: string, updates: Partial<T>) => {
    if (!db) return false;

    try {
      const transaction = db.transaction([storeName, 'operations'], 'readwrite');
      const dataStore = transaction.objectStore(storeName);
      const operationsStore = transaction.objectStore('operations');

      // Get existing data
      const getRequest = dataStore.get(id);
      await new Promise<void>((resolve, reject) => {
        getRequest.onsuccess = () => resolve();
        getRequest.onerror = () => reject(getRequest.error);
      });

      const existingData = getRequest.result;
      if (!existingData) {
        console.error('Data not found for update');
        return false;
      }

      // Update data
      const updatedData = { ...existingData, ...updates };
      const updateRequest = dataStore.put(updatedData);

      // Create operation for sync
      const operation: OfflineOperation = {
        id: `op_${Date.now()}_${Math.random()}`,
        type: 'update',
        collection,
        data: { id, updates },
        timestamp: new Date().toISOString(),
        synced: false
      };

      const operationRequest = operationsStore.add(operation);

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      setPendingOperations(prev => [...prev, operation]);
      return true;
    } catch (error) {
      console.error('Failed to update data offline:', error);
      return false;
    }
  }, [db, storeName]);

  // Delete data offline
  const deleteOffline = useCallback(async (collection: string, id: string) => {
    if (!db) return false;

    try {
      const transaction = db.transaction([storeName, 'operations'], 'readwrite');
      const dataStore = transaction.objectStore(storeName);
      const operationsStore = transaction.objectStore('operations');

      // Delete data
      const deleteRequest = dataStore.delete(id);

      // Create operation for sync
      const operation: OfflineOperation = {
        id: `op_${Date.now()}_${Math.random()}`,
        type: 'delete',
        collection,
        data: { id },
        timestamp: new Date().toISOString(),
        synced: false
      };

      const operationRequest = operationsStore.add(operation);

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      setPendingOperations(prev => [...prev, operation]);
      return true;
    } catch (error) {
      console.error('Failed to delete data offline:', error);
      return false;
    }
  }, [db, storeName]);

  // Sync pending operations
  const syncPendingOperations = useCallback(async (syncFunction: (operation: OfflineOperation) => Promise<boolean>) => {
    if (!db || !isOnline || isSyncing) return;

    setIsSyncing(true);
    const unsyncedOperations = pendingOperations.filter(op => !op.synced);

    try {
      for (const operation of unsyncedOperations) {
        try {
          const success = await syncFunction(operation);
          
          if (success) {
            // Mark operation as synced
            const transaction = db.transaction(['operations'], 'readwrite');
            const store = transaction.objectStore('operations');
            
            const updatedOperation = { ...operation, synced: true };
            await store.put(updatedOperation);
            
            // Remove from pending operations
            setPendingOperations(prev => prev.filter(op => op.id !== operation.id));
          }
        } catch (error) {
          console.error(`Failed to sync operation ${operation.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [db, isOnline, isSyncing, pendingOperations]);

  // Clear all data
  const clearOfflineData = useCallback(async (collection?: string) => {
    if (!db) return false;

    try {
      const transaction = db.transaction([storeName, 'operations'], 'readwrite');
      const dataStore = transaction.objectStore(storeName);
      const operationsStore = transaction.objectStore('operations');

      if (collection) {
        // Clear specific collection
        const index = dataStore.index('collection');
        const request = index.openCursor(collection);
        
        await new Promise<void>((resolve, reject) => {
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
              cursor.delete();
              cursor.continue();
            } else {
              resolve();
            }
          };
          request.onerror = () => reject(request.error);
        });

        // Clear related operations
        const opIndex = operationsStore.index('collection');
        const opRequest = opIndex.openCursor(collection);
        
        await new Promise<void>((resolve, reject) => {
          opRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
              cursor.delete();
              cursor.continue();
            } else {
              resolve();
            }
          };
          opRequest.onerror = () => reject(opRequest.error);
        });
      } else {
        // Clear all data
        await dataStore.clear();
        await operationsStore.clear();
      }

      setPendingOperations([]);
      return true;
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      return false;
    }
  }, [db, storeName]);

  // Get storage stats
  const getStorageStats = useCallback(async () => {
    if (!db) return null;

    try {
      const transaction = db.transaction([storeName, 'operations'], 'readonly');
      const dataStore = transaction.objectStore(storeName);
      const operationsStore = transaction.objectStore('operations');

      const dataCount = await new Promise<number>((resolve) => {
        const request = dataStore.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(0);
      });

      const operationsCount = await new Promise<number>((resolve) => {
        const request = operationsStore.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(0);
      });

      const unsyncedCount = pendingOperations.filter(op => !op.synced).length;

      return {
        totalData: dataCount,
        totalOperations: operationsCount,
        pendingSync: unsyncedCount,
        isOnline,
        storageEstimate: await navigator.storage?.estimate()
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return null;
    }
  }, [db, storeName, isOnline, pendingOperations]);

  return {
    db,
    isOnline,
    isSyncing,
    pendingOperations,
    saveOffline,
    getOffline,
    updateOffline,
    deleteOffline,
    syncPendingOperations,
    clearOfflineData,
    getStorageStats
  };
}