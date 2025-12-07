#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function createUser() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || 'test';

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to:', mongoUri);
    console.log('Database:', dbName);

    await mongoose.connect(mongoUri, { dbName });
    console.log('✅ Připojeno k MongoDB:', mongoose.connection.db.databaseName);

    // Vytvořit hash ručně
    const password = 'test123';
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Najít collection přímo
    const db = mongoose.connection.db;
    const collection = db.collection('simpleadminusers');

    // Smazat existující admin
    await collection.deleteMany({ username: 'admin' });

    // Vložit nového uživatele přímo
    const result = await collection.insertOne({
      username: 'admin',
      password: hashedPassword,
      isActive: true,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    });

    console.log('✅ Uživatel vytvořen přímo:', result.insertedId);

    // Test porovnání
    const testHash = await bcrypt.compare(password, hashedPassword);
    console.log('✅ Test porovnání hesla:', testHash);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Chyba:', error);
    process.exit(1);
  }
}

createUser();