"use client";

export default function OfflinePage() {
  const handleReload = () => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          It looks like you've lost your internet connection. Some features may be unavailable until you're back online.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• You can still view previously loaded pages</p>
          <p>• Your data will be synced when you reconnect</p>
          <p>• Check your connection and try again</p>
        </div>
        <button 
          onClick={handleReload} 
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}