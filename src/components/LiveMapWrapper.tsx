"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the LiveMap component with no SSR
const LiveMap = dynamic(() => import("./LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
});

interface LiveMapWrapperProps {
  guards: any[];
  geofences: any[];
  alerts: any[];
  center?: [number, number];
  zoom?: number;
}

export default function LiveMapWrapper({ guards, geofences, alerts, center, zoom }: LiveMapWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return <LiveMap guards={guards} geofences={geofences} alerts={alerts} center={center} zoom={zoom} />;
}