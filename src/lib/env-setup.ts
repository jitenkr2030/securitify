// ============================================
// CRITICAL: This file MUST be imported BEFORE
// @prisma/client in any module. It sets up
// environment variables that Prisma needs at
// initialization time.
// ============================================

// Map Neon integration variable to DATABASE_URL
if (!process.env.DATABASE_URL) {
  let url =
    process.env.storage_POSTGRES_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    "";

  // Strip channel_binding parameter which Prisma 6 doesn't support
  if (url) {
    url = url.replace(/channel_binding=require&?/g, "");
    // Clean up if channel_binding was the only param and left a trailing ?
    url = url.replace(/\?$/, "");
    // Clean up if removing channel_binding left && or ?&
    url = url.replace(/\?&/, "?").replace(/&&/g, "&");
  }

  if (url) {
    process.env.DATABASE_URL = url;
    console.log("✅ DATABASE_URL set from storage_POSTGRES_URL");
  } else {
    console.error(
      "❌ No database URL found. Checked: DATABASE_URL, storage_POSTGRES_URL, POSTGRES_URL, POSTGRES_PRISMA_URL"
    );
  }
}

// Ensure NEXTAUTH_SECRET is always set
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "securitify-production-secret-jiten2024";
}

// Ensure NEXTAUTH_URL matches the actual domain users visit
if (!process.env.NEXTAUTH_URL) {
  if (process.env.VERCEL_ENV === "production") {
    process.env.NEXTAUTH_URL = "https://securitifyapp.vercel.app";
  } else if (process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  } else {
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  }
}
