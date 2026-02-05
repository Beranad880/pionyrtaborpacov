#!/usr/bin/env node

/**
 * Skript pro správu admin uživatelů
 *
 * Použití:
 * node scripts/manage-admin-users.js list                # Seznam uživatelů
 * node scripts/manage-admin-users.js add <user> <pass>   # Přidání uživatele
 * node scripts/manage-admin-users.js remove <user>       # Odstranění uživatele
 * node scripts/manage-admin-users.js reset <user> <pass> # Reset hesla
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function connect() {
  console.log('🔄 Připojuji se k MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Připojeno\n');
  return mongoose.connection.db.collection('simpleadminusers');
}

async function listUsers() {
  const collection = await connect();

  const users = await collection.find({}, { projection: { password: 0 } }).toArray();

  if (users.length === 0) {
    console.log('📭 Žádní admin uživatelé');
  } else {
    console.log('📋 Admin uživatelé:\n');
    users.forEach((user, i) => {
      console.log(`  ${i + 1}. ${user.username}`);
      console.log(`     Role: ${user.role || 'admin'}`);
      console.log(`     Aktivní: ${user.isActive ? 'Ano' : 'Ne'}`);
      console.log(`     Vytvořen: ${user.createdAt?.toLocaleDateString?.('cs-CZ') || user.createdAt || 'N/A'}`);
      console.log(`     Poslední login: ${user.lastLogin?.toLocaleDateString?.('cs-CZ') || user.lastLogin || 'Nikdy'}`);
      console.log('');
    });
    console.log(`Celkem: ${users.length} uživatelů`);
  }

  await mongoose.disconnect();
}

async function addUser(username, password) {
  if (!username || !password) {
    console.log('❌ Použití: node scripts/manage-admin-users.js add <username> <password>');
    process.exit(1);
  }

  const collection = await connect();

  const existing = await collection.findOne({ username });
  if (existing) {
    console.log(`❌ Uživatel '${username}' již existuje`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await collection.insertOne({
    username,
    password: hashedPassword,
    role: 'admin',
    isActive: true,
    createdBy: 'cli-script',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: null
  });

  console.log(`✅ Uživatel '${username}' vytvořen`);
  await mongoose.disconnect();
}

async function removeUser(username) {
  if (!username) {
    console.log('❌ Použití: node scripts/manage-admin-users.js remove <username>');
    process.exit(1);
  }

  const collection = await connect();

  const result = await collection.deleteOne({ username });

  if (result.deletedCount === 0) {
    console.log(`❌ Uživatel '${username}' nenalezen`);
  } else {
    console.log(`✅ Uživatel '${username}' odstraněn`);
  }

  await mongoose.disconnect();
}

async function resetPassword(username, newPassword) {
  if (!username || !newPassword) {
    console.log('❌ Použití: node scripts/manage-admin-users.js reset <username> <new-password>');
    process.exit(1);
  }

  const collection = await connect();

  const user = await collection.findOne({ username });

  if (!user) {
    console.log(`❌ Uživatel '${username}' nenalezen`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await collection.updateOne(
    { username },
    { $set: { password: hashedPassword, updatedAt: new Date() } }
  );

  console.log(`✅ Heslo pro '${username}' bylo resetováno`);
  await mongoose.disconnect();
}

// Hlavní
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'list':
    listUsers();
    break;
  case 'add':
    addUser(args[1], args[2]);
    break;
  case 'remove':
    removeUser(args[1]);
    break;
  case 'reset':
    resetPassword(args[1], args[2]);
    break;
  default:
    console.log('🔧 Správa admin uživatelů\n');
    console.log('Použití:');
    console.log('  node scripts/manage-admin-users.js list                # Seznam uživatelů');
    console.log('  node scripts/manage-admin-users.js add <user> <pass>   # Přidání');
    console.log('  node scripts/manage-admin-users.js remove <user>       # Odstranění');
    console.log('  node scripts/manage-admin-users.js reset <user> <pass> # Reset hesla');
}
