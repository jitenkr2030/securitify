"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import PWARegistration with no SSR
const PWARegistration = dynamic(
  () => import("./PWARegistration"),
  { ssr: false }
);

export default function PWAWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <PWARegistration />;
}