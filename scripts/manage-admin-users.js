#!/usr/bin/env node

/**
 * CLI skript pro správu admin uživatelů
 *
 * Použití:
 * node scripts/manage-admin-users.js add <username> <password>
 * node scripts/manage-admin-users.js remove <username>
 * node scripts/manage-admin-users.js list
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// MongoDB connection
const connectToDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pionyr-pacov';
    await mongoose.connect(mongoUri);
    console.log('✅ Připojeno k MongoDB');
  } catch (error) {
    console.error('❌ Chyba připojení k databázi:', error.message);
    process.exit(1);
  }
};

// Admin User Schema (stejné jako v modelu)
const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Hash password před uložením
adminUserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Metoda pro kontrolu hesla
adminUserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

// Funkce pro přidání uživatele
const addUser = async (username, password) => {
  try {
    // Validace vstupu
    if (!username || !password) {
      console.error('❌ Username a password jsou povinné');
      return;
    }

    if (username.length < 3) {
      console.error('❌ Username musí mít alespoň 3 znaky');
      return;
    }

    if (password.length < 6) {
      console.error('❌ Password musí mít alespoň 6 znaků');
      return;
    }

    // Kontrola existence
    const existingUser = await AdminUser.findOne({ username });
    if (existingUser) {
      console.error(`❌ Uživatel '${username}' už existuje`);
      return;
    }

    // Vytvoření uživatele
    const user = new AdminUser({ username, password });
    await user.save();

    console.log(`✅ Uživatel '${username}' byl úspěšně vytvořen`);
    console.log(`📅 Datum vytvoření: ${user.createdAt.toLocaleString('cs-CZ')}`);

  } catch (error) {
    console.error('❌ Chyba při vytváření uživatele:', error.message);
  }
};

// Funkce pro odstranění uživatele
const removeUser = async (username) => {
  try {
    if (!username) {
      console.error('❌ Username je povinný');
      return;
    }

    const deletedUser = await AdminUser.findOneAndDelete({ username });

    if (!deletedUser) {
      console.error(`❌ Uživatel '${username}' nebyl nalezen`);
      return;
    }

    console.log(`✅ Uživatel '${username}' byl úspěšně odstraněn`);

  } catch (error) {
    console.error('❌ Chyba při odstraňování uživatele:', error.message);
  }
};

// Funkce pro výpis všech uživatelů
const listUsers = async () => {
  try {
    const users = await AdminUser.find({}).select('-password').sort({ createdAt: -1 });

    if (users.length === 0) {
      console.log('📝 Žádní uživatelé nebyli nalezeni');
      return;
    }

    console.log(`\n📋 Seznam admin uživatelů (${users.length}):\n`);
    console.log('┌─────────────────────────┬─────────────────────┬─────────────────────┐');
    console.log('│ Username                │ Vytvořen            │ Poslední přihlášení │');
    console.log('├─────────────────────────┼─────────────────────┼─────────────────────┤');

    users.forEach(user => {
      const username = user.username.padEnd(23);
      const created = user.createdAt.toLocaleString('cs-CZ', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).padEnd(19);
      const lastLogin = user.lastLogin ?
        user.lastLogin.toLocaleString('cs-CZ', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).padEnd(19) :
        'Nikdy'.padEnd(19);

      console.log(`│ ${username} │ ${created} │ ${lastLogin} │`);
    });

    console.log('└─────────────────────────┴─────────────────────┴─────────────────────┘\n');

  } catch (error) {
    console.error('❌ Chyba při výpisu uživatelů:', error.message);
  }
};

// Hlavní funkce
const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`
🔧 Admin User Management CLI

Použití:
  node scripts/manage-admin-users.js add <username> <password>     - Přidat nového uživatele
  node scripts/manage-admin-users.js remove <username>            - Odstranit uživatele
  node scripts/manage-admin-users.js list                         - Vypsat všechny uživatele

Příklady:
  node scripts/manage-admin-users.js add admin secretpassword123
  node scripts/manage-admin-users.js remove olduser
  node scripts/manage-admin-users.js list
    `);
    process.exit(1);
  }

  await connectToDatabase();

  switch (command.toLowerCase()) {
    case 'add':
      const [, username, password] = args;
      await addUser(username, password);
      break;

    case 'remove':
    case 'delete':
      const [, usernameToRemove] = args;
      await removeUser(usernameToRemove);
      break;

    case 'list':
    case 'ls':
      await listUsers();
      break;

    default:
      console.error(`❌ Neznámý příkaz: ${command}`);
      console.log('Dostupné příkazy: add, remove, list');
      process.exit(1);
  }

  await mongoose.disconnect();
  process.exit(0);
};

// Spustit skript
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Neočekávaná chyba:', error);
    process.exit(1);
  });
}

module.exports = { addUser, removeUser, listUsers };