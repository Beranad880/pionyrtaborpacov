/**
 * Skript pro vytvoření admin uživatele
 *
 * Použití:
 * node scripts/create-simple-user.js <username> <password>
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function createUser(username, password) {
  try {
    console.log('🔄 Připojuji se k MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Připojeno k MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('simpleadminusers');

    // Kontrola existence
    const existing = await collection.findOne({ username });
    if (existing) {
      console.log(`❌ Uživatel '${username}' již existuje`);
      process.exit(1);
    }

    // Hash hesla
    const hashedPassword = await bcrypt.hash(password, 12);

    // Vytvoření uživatele
    const result = await collection.insertOne({
      username,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdBy: 'cli-script',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    });

    console.log(`✅ Uživatel '${username}' byl úspěšně vytvořen (ID: ${result.insertedId})`);

  } catch (error) {
    console.error('❌ Chyba:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Hlavní
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Použití: node scripts/create-simple-user.js <username> <password>');
  console.log('Příklad: node scripts/create-simple-user.js admin heslo123');
  process.exit(1);
}

createUser(args[0], args[1]);
