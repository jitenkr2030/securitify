import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import HeaderNavigation from "@/components/HeaderNavigation";
import PWAWrapper from "@/components/PWAWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Securitify - Security Management System",
  description: "Comprehensive security management platform for field officers, guards, and site operations. Built with Next.js, TypeScript, and modern web technologies.",
  keywords: ["Securitify", "Security", "Field Operations", "Guard Management", "Site Inspection", "Incident Response"],
  authors: [{ name: "Securitify Team" }],
  openGraph: {
    title: "Securitify - Security Management System",
    description: "Comprehensive security management platform for field operations",
    url: "https://securitify.app",
    siteName: "Securitify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Securitify - Security Management System",
    description: "Comprehensive security management platform for field operations",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Securitify",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-167x167.png", sizes: "167x167", type: "image/png" },
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Securitify",
    "application-name": "Securitify",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-TileColor": "#2563eb",
    "msapplication-TileImage": "/icons/icon-144x144.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="mask-icon" href="/icons/icon.svg" color="#2563eb" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {/* HEADER UPDATE CONFIRMATION */}
          <HeaderNavigation />
          {children}
          <Toaster />
          <PWAWrapper />
        </Providers>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
              
              // Register for push notifications
              if ('Notification' in window && 'serviceWorker' in navigator) {
                Notification.requestPermission().then((permission) => {
                  if (permission === 'granted') {
                    console.log('Notification permission granted.');
                  }
                });
              }
              
              // Handle online/offline status
              window.addEventListener('online', () => {
                document.body.classList.remove('offline');
                console.log('App is online');
              });
              
              window.addEventListener('offline', () => {
                document.body.classList.add('offline');
                console.log('App is offline');
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
