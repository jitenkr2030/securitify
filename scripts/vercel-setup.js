const fs = require('fs');
const path = require('path');

// Ensure data directory exists for Vercel
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory for Vercel');
}

// Copy database file if it doesn't exist
const dbPath = path.join(dataDir, 'dev.db');
const localDbPath = path.join(__dirname, '..', 'db', 'custom.db');

if (!fs.existsSync(dbPath) && fs.existsSync(localDbPath)) {
  fs.copyFileSync(localDbPath, dbPath);
  console.log('✅ Copied local database to Vercel location');
} else if (!fs.existsSync(dbPath)) {
  console.log('⚠️  No local database found. A new one will be created on first run.');
}

console.log('🚀 Vercel setup complete');