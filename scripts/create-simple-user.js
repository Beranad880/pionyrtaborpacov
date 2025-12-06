#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createUser() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pionyr-pacov';
    await mongoose.connect(mongoUri);
    console.log('✅ Připojeno k MongoDB');

    // Vytvořit hash ručně
    const password = 'test123';
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Najít collection přímo
    const db = mongoose.connection.db;
    const collection = db.collection('adminusers');

    // Smazat existující admin
    await collection.deleteMany({ username: 'admin' });

    // Vložit nového uživatele přímo
    const result = await collection.insertOne({
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date(),
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