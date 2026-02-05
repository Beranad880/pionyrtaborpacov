#!/usr/bin/env node

/**
 * Database Cleanup Script
 * Zobrazí stav databáze a umožní vyčištění kolekcí
 *
 * Použití:
 * node scripts/cleanup-database.js              # Zobrazí stav
 * node scripts/cleanup-database.js --all        # Smaže vše
 * node scripts/cleanup-database.js --collection <název>  # Smaže konkrétní kolekci
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function cleanup(options) {
  try {
    console.log('🔄 Připojuji se k MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Připojeno k MongoDB\n');

    const db = mongoose.connection.db;

    if (options.all) {
      console.log('⚠️  Mažu VŠECHNY kolekce...\n');

      const collections = await db.listCollections().toArray();

      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        await db.collection(col.name).deleteMany({});
        console.log(`  🗑️  ${col.name}: smazáno ${count} dokumentů`);
      }

      console.log('\n✅ Všechny kolekce vyčištěny');

    } else if (options.collection) {
      const colName = options.collection;
      const collection = db.collection(colName);

      const count = await collection.countDocuments();
      await collection.deleteMany({});

      console.log(`✅ Kolekce '${colName}': smazáno ${count} dokumentů`);

    } else {
      // Zobrazit statistiky
      console.log('📊 Aktuální stav databáze:\n');

      const collections = await db.listCollections().toArray();

      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  📁 ${col.name}: ${count} dokumentů`);
      }

      console.log('\nPro smazání použij:');
      console.log('  --all                    Smaže všechny kolekce');
      console.log('  --collection <název>     Smaže konkrétní kolekci');
    }

  } catch (error) {
    console.error('❌ Chyba:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Parsování argumentů
const args = process.argv.slice(2);
const options = {
  all: args.includes('--all'),
  collection: null
};

const colIndex = args.indexOf('--collection');
if (colIndex !== -1 && args[colIndex + 1]) {
  options.collection = args[colIndex + 1];
}

cleanup(options);
