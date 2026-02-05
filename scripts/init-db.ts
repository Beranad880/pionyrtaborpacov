#!/usr/bin/env npx tsx

/**
 * Database Initialization Script
 * Inicializuje databázi s výchozími daty
 *
 * Použití:
 * npm run db:init
 * nebo
 * npx tsx scripts/init-db.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function initializeDatabase() {
  try {
    console.log('🔄 Připojuji se k MongoDB...');

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI není nastavena v .env.local');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Připojeno k MongoDB\n');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Nepodařilo se připojit k databázi');
    }
    const usersCollection = db.collection('simpleadminusers');

    // Kontrola existujících uživatelů
    const existingUsers = await usersCollection.countDocuments();
    console.log(`📊 Existující admin uživatelé: ${existingUsers}`);

    if (existingUsers === 0) {
      // Vytvoření defaultního admin uživatele
      const hashedPassword = await bcrypt.hash('admin123', 12);

      await usersCollection.insertOne({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdBy: 'init-script',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null
      });

      console.log('✅ Výchozí admin uživatel vytvořen (admin / admin123)');
      console.log('⚠️  DŮLEŽITÉ: Změňte heslo po prvním přihlášení!');
    } else {
      console.log('ℹ️  Admin uživatelé již existují, přeskakuji vytvoření');
    }

    // Zobrazit souhrn
    console.log('\n📊 Souhrn databáze:');
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   ${col.name}: ${count} dokumentů`);
    }

    console.log('\n🎉 Inicializace dokončena!');

  } catch (error: any) {
    console.error('❌ Chyba inicializace:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

initializeDatabase();
