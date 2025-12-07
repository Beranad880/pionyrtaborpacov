#!/usr/bin/env node

/**
 * Skript pro import admin uživatelů z JSON souboru do MongoDB kolekce adminusers
 *
 * Použití:
 * node scripts/import-admin-credentials.js [cesta-k-json-souboru]
 *
 * Pokud není cesta zadána, hledá se soubor admin_credentials.json v kořenu projektu
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
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

const AdminUser = mongoose.model('SimpleAdminUser', adminUserSchema);

// Funkce pro import uživatelů z JSON souboru
const importAdminCredentials = async (filePath) => {
  try {
    // Kontrola existence souboru
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Soubor ${filePath} neexistuje`);
      return;
    }

    // Načtení JSON souboru
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let adminData;

    try {
      adminData = JSON.parse(fileContent);
    } catch (parseError) {
      console.error(`❌ Chyba při parsování JSON souboru: ${parseError.message}`);
      return;
    }

    console.log(`📂 Načítám data ze souboru: ${filePath}`);

    // Podpora různých formátů JSON
    let admins = [];

    if (Array.isArray(adminData)) {
      // Pokud je to pole adminu
      admins = adminData;
    } else if (adminData.admins && Array.isArray(adminData.admins)) {
      // Pokud je struktura { "admins": [...] }
      admins = adminData.admins;
    } else if (adminData.username && adminData.password) {
      // Pokud je to jeden admin objekt
      admins = [adminData];
    } else {
      console.error('❌ Neplatný formát JSON souboru. Očekávané formáty:');
      console.log('   1. [{"username": "admin1", "password": "heslo1"}, ...]');
      console.log('   2. {"admins": [{"username": "admin1", "password": "heslo1"}, ...]});
      console.log('   3. {"username": "admin", "password": "heslo"}');
      return;
    }

    if (admins.length === 0) {
      console.log('⚠️  Žádní admin uživatelé k importu');
      return;
    }

    console.log(`🔍 Nalezeno ${admins.length} admin uživatelů k importu\n`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const adminInfo of admins) {
      try {
        // Validace struktury
        if (!adminInfo.username || !adminInfo.password) {
          console.error(`⚠️  Přeskakuji uživatele: chybí username nebo password`);
          skipped++;
          continue;
        }

        // Validace délky
        if (adminInfo.username.length < 3) {
          console.error(`⚠️  Přeskakuji '${adminInfo.username}': username musí mít alespoň 3 znaky`);
          skipped++;
          continue;
        }

        if (adminInfo.password.length < 6) {
          console.error(`⚠️  Přeskakuji '${adminInfo.username}': password musí mít alespoň 6 znaků`);
          skipped++;
          continue;
        }

        // Kontrola existence
        const existingUser = await AdminUser.findOne({ username: adminInfo.username });
        if (existingUser) {
          console.log(`⚠️  Uživatel '${adminInfo.username}' už existuje - přeskakuji`);
          skipped++;
          continue;
        }

        // Vytvoření uživatele
        const user = new AdminUser({
          username: adminInfo.username,
          password: adminInfo.password
        });
        await user.save();

        console.log(`✅ Uživatel '${adminInfo.username}' byl úspěšně importován`);
        imported++;

      } catch (error) {
        console.error(`❌ Chyba při importu uživatele '${adminInfo.username}': ${error.message}`);
        errors++;
      }
    }

    // Shrnutí
    console.log(`\n📊 Import dokončen:`);
    console.log(`   ✅ Importováno: ${imported}`);
    console.log(`   ⚠️  Přeskočeno: ${skipped}`);
    console.log(`   ❌ Chyby: ${errors}`);
    console.log(`   📝 Celkem zpracováno: ${imported + skipped + errors}`);

  } catch (error) {
    console.error('❌ Neočekávaná chyba při importu:', error.message);
  }
};

// Hlavní funkce
const main = async () => {
  const args = process.argv.slice(2);
  let filePath = args[0];

  // Pokud není zadána cesta, použij defaultní
  if (!filePath) {
    filePath = path.join(process.cwd(), 'admin_credentials.json');
  }

  // Převedení relativní cesty na absolutní
  if (!path.isAbsolute(filePath)) {
    filePath = path.join(process.cwd(), filePath);
  }

  console.log(`🔧 Import Admin Credentials do MongoDB\n`);

  await connectToDatabase();
  await importAdminCredentials(filePath);

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

module.exports = { importAdminCredentials };
