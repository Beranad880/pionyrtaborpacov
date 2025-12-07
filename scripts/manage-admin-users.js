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

// SimpleAdminUser Schema (aby odpovídala modelu používanému v API)
const simpleAdminUserSchema = new mongoose.Schema({
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
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['admin', 'moderator'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdBy: {
    type: String,
    default: 'cli-script'
  }
}, {
  timestamps: true
});

// Hash password před uložením
simpleAdminUserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Metoda pro kontrolu hesla
simpleAdminUserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const AdminUser = mongoose.model('SimpleAdminUser', simpleAdminUserSchema);

// Funkce pro uložení do admin_credentials.json
const saveToCredentialsFile = async (username, password) => {
  try {
    const credentialsPath = path.join(process.cwd(), 'admin_credentials.json');
    let credentialsData = { admins: [] };

    // Načti existující soubor, pokud existuje
    if (fs.existsSync(credentialsPath)) {
      try {
        const existingContent = fs.readFileSync(credentialsPath, 'utf8');
        credentialsData = JSON.parse(existingContent);

        // Zajisti, že struktura je správná
        if (!credentialsData.admins || !Array.isArray(credentialsData.admins)) {
          credentialsData = { admins: [] };
        }
      } catch (parseError) {
        console.log('⚠️  Existující admin_credentials.json má neplatný formát, vytvářím nový');
        credentialsData = { admins: [] };
      }
    }

    // Hash heslo pro JSON soubor
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Kontrola, zda uživatel už není v JSON souboru
    const existingInJson = credentialsData.admins.find(admin => admin.username === username);
    if (existingInJson) {
      console.log(`📝 Uživatel '${username}' už existuje v admin_credentials.json - aktualizuji heslo`);
      existingInJson.password = hashedPassword;
      existingInJson.passwordHashed = true;
    } else {
      // Přidej nového uživatele
      credentialsData.admins.push({
        username,
        password: hashedPassword,
        passwordHashed: true
      });
    }

    // Ulož zpět do souboru
    fs.writeFileSync(credentialsPath, JSON.stringify(credentialsData, null, 2), 'utf8');
    console.log(`💾 Přihlašovací údaje uloženy do admin_credentials.json (heslo zahashováno bcrypt)`);

  } catch (error) {
    console.error('❌ Chyba při ukládání do admin_credentials.json:', error.message);
  }
};

// Funkce pro odstranění z admin_credentials.json
const removeFromCredentialsFile = async (username) => {
  try {
    const credentialsPath = path.join(process.cwd(), 'admin_credentials.json');

    if (!fs.existsSync(credentialsPath)) {
      console.log('📝 Soubor admin_credentials.json neexistuje');
      return;
    }

    const existingContent = fs.readFileSync(credentialsPath, 'utf8');
    let credentialsData;

    try {
      credentialsData = JSON.parse(existingContent);
    } catch (parseError) {
      console.log('⚠️  admin_credentials.json má neplatný formát');
      return;
    }

    // Zajisti, že struktura je správná
    if (!credentialsData.admins || !Array.isArray(credentialsData.admins)) {
      console.log('⚠️  admin_credentials.json nemá správnou strukturu');
      return;
    }

    // Najdi a odstraň uživatele
    const initialLength = credentialsData.admins.length;
    credentialsData.admins = credentialsData.admins.filter(admin => admin.username !== username);

    if (credentialsData.admins.length < initialLength) {
      fs.writeFileSync(credentialsPath, JSON.stringify(credentialsData, null, 2), 'utf8');
      console.log(`💾 Uživatel '${username}' odstraněn z admin_credentials.json`);
    } else {
      console.log(`📝 Uživatel '${username}' nebyl nalezen v admin_credentials.json`);
    }

  } catch (error) {
    console.error('❌ Chyba při odstraňování z admin_credentials.json:', error.message);
  }
};

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

    // Vytvoření uživatele v SimpleAdminUser modelu
    const user = new AdminUser({
      username,
      password,
      role: 'admin',
      isActive: true,
      createdBy: 'cli-script'
    });
    await user.save();

    console.log(`✅ Uživatel '${username}' byl úspěšně vytvořen v MongoDB (SimpleAdminUser)`);
    console.log(`📅 Datum vytvoření: ${user.createdAt.toLocaleString('cs-CZ')}`);

    // Ulož také do admin_credentials.json
    await saveToCredentialsFile(username, password);

    // Automaticky synchronizuj všechny uživatele z admin_credentials.json
    console.log(`\n🔄 Automatická synchronizace z admin_credentials.json...`);
    await syncFromCredentialsQuiet();

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
      console.error(`❌ Uživatel '${username}' nebyl nalezen v MongoDB`);
      return;
    }

    console.log(`✅ Uživatel '${username}' byl úspěšně odstraněn z MongoDB`);

    // Odstraň také z admin_credentials.json
    await removeFromCredentialsFile(username);

  } catch (error) {
    console.error('❌ Chyba při odstraňování uživatele:', error.message);
  }
};

// Funkce pro synchronizaci z admin_credentials.json do MongoDB
const syncFromCredentials = async () => {
  try {
    const credentialsPath = path.join(process.cwd(), 'admin_credentials.json');

    if (!fs.existsSync(credentialsPath)) {
      console.error('❌ Soubor admin_credentials.json neexistuje');
      console.log('💡 Vytvořte soubor pomocí: npm run admin:add <username> <password>');
      return;
    }

    console.log(`📂 Načítám admin_credentials.json...`);

    const fileContent = fs.readFileSync(credentialsPath, 'utf8');
    let adminData;

    try {
      adminData = JSON.parse(fileContent);
    } catch (parseError) {
      console.error(`❌ Chyba při parsování JSON souboru: ${parseError.message}`);
      return;
    }

    // Podpora různých formátů JSON
    let admins = [];

    if (Array.isArray(adminData)) {
      admins = adminData;
    } else if (adminData.admins && Array.isArray(adminData.admins)) {
      admins = adminData.admins;
    } else if (adminData.username && adminData.password) {
      admins = [adminData];
    } else {
      console.error('❌ Neplatný formát JSON souboru');
      return;
    }

    if (admins.length === 0) {
      console.log('⚠️  Žádní admin uživatelé k synchronizaci');
      return;
    }

    console.log(`🔍 Nalezeno ${admins.length} admin uživatelů v JSON souboru`);
    console.log(`🔄 Synchronizuji do MongoDB...\n`);

    let synced = 0;
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

        // Pro zahashovaná hesla (bcrypt) nevalidujeme délku
        if (!adminInfo.passwordHashed && adminInfo.password.length < 6) {
          console.error(`⚠️  Přeskakuji '${adminInfo.username}': nezahashované password musí mít alespoň 6 znaků`);
          skipped++;
          continue;
        }

        // Kontrola existence v MongoDB
        const existingUser = await AdminUser.findOne({ username: adminInfo.username });
        if (existingUser) {
          console.log(`⚠️  Uživatel '${adminInfo.username}' už existuje v MongoDB - přeskakuji`);
          skipped++;
          continue;
        }

        // Vytvoření uživatele v MongoDB
        let userPassword = adminInfo.password;

        // Vytvoření uživatele v SimpleAdminUser modelu
        if (adminInfo.passwordHashed) {
          const user = new AdminUser({
            username: adminInfo.username,
            role: 'admin',
            isActive: true,
            createdBy: 'json-import'
          });
          // Nastavíme zahashované heslo přímo, obejdeme pre-save hook
          user.password = adminInfo.password;
          await user.save({ validateBeforeSave: false });
        } else {
          // Standardní způsob - nechá pre-save hook zahashovat heslo
          const user = new AdminUser({
            username: adminInfo.username,
            password: userPassword,
            role: 'admin',
            isActive: true,
            createdBy: 'json-import'
          });
          await user.save();
        }

        console.log(`✅ Uživatel '${adminInfo.username}' synchronizován do MongoDB`);
        synced++;

      } catch (error) {
        console.error(`❌ Chyba při synchronizaci uživatele '${adminInfo.username}': ${error.message}`);
        errors++;
      }
    }

    // Shrnutí
    console.log(`\n📊 Synchronizace dokončena:`);
    console.log(`   ✅ Synchronizováno: ${synced}`);
    console.log(`   ⚠️  Přeskočeno: ${skipped}`);
    console.log(`   ❌ Chyby: ${errors}`);
    console.log(`   📝 Celkem zpracováno: ${synced + skipped + errors}`);

    if (synced > 0) {
      console.log(`\n💡 Pro zobrazení všech uživatelů spusťte: npm run admin:list`);
    }

  } catch (error) {
    console.error('❌ Neočekávaná chyba při synchronizaci:', error.message);
  }
};

// Funkce pro tichou synchronizaci z admin_credentials.json (pro auto-sync)
const syncFromCredentialsQuiet = async () => {
  try {
    const credentialsPath = path.join(process.cwd(), 'admin_credentials.json');

    if (!fs.existsSync(credentialsPath)) {
      console.log(`📝 Soubor admin_credentials.json zatím neexistuje`);
      return;
    }

    const fileContent = fs.readFileSync(credentialsPath, 'utf8');
    let adminData;

    try {
      adminData = JSON.parse(fileContent);
    } catch (parseError) {
      console.log('⚠️  admin_credentials.json má neplatný formát - přeskakuji auto-sync');
      return;
    }

    // Podpora různých formátů JSON
    let admins = [];
    if (Array.isArray(adminData)) {
      admins = adminData;
    } else if (adminData.admins && Array.isArray(adminData.admins)) {
      admins = adminData.admins;
    } else if (adminData.username && adminData.password) {
      admins = [adminData];
    }

    if (admins.length === 0) {
      return;
    }

    let synced = 0;
    let skipped = 0;

    for (const adminInfo of admins) {
      try {
        // Základní validace
        if (!adminInfo.username || !adminInfo.password) continue;
        if (adminInfo.username.length < 3) continue;
        // Pro zahashovaná hesla neskačeme validaci délky
        if (!adminInfo.passwordHashed && adminInfo.password.length < 6) continue;

        // Kontrola existence v MongoDB
        const existingUser = await AdminUser.findOne({ username: adminInfo.username });
        if (existingUser) {
          skipped++;
          continue;
        }

        // Vytvoření uživatele v SimpleAdminUser modelu
        if (adminInfo.passwordHashed) {
          const user = new AdminUser({
            username: adminInfo.username,
            role: 'admin',
            isActive: true,
            createdBy: 'auto-sync'
          });
          // Nastavíme zahashované heslo přímo, obejdeme pre-save hook
          user.password = adminInfo.password;
          await user.save({ validateBeforeSave: false });
        } else {
          // Standardní způsob - nechá pre-save hook zahashovat heslo
          const user = new AdminUser({
            username: adminInfo.username,
            password: adminInfo.password,
            role: 'admin',
            isActive: true,
            createdBy: 'auto-sync'
          });
          await user.save();
        }

        console.log(`   ✅ Synchronizován '${adminInfo.username}'`);
        synced++;

      } catch (error) {
        // Tichá chyba - nepíšeme ji
        continue;
      }
    }

    if (synced > 0) {
      console.log(`🔄 Auto-sync dokončen: ${synced} nových, ${skipped} existujících`);
    } else if (skipped > 0) {
      console.log(`📝 Auto-sync: všichni uživatelé (${skipped}) už existují`);
    }

  } catch (error) {
    // Tichá chyba - jen základní info
    console.log('⚠️  Auto-sync selhal - pokračuji bez něj');
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
  node scripts/manage-admin-users.js add <username> <password>     - Přidat uživatele do MongoDB + admin_credentials.json
  node scripts/manage-admin-users.js remove <username>            - Odstranit z MongoDB + admin_credentials.json
  node scripts/manage-admin-users.js list                         - Vypsat všechny uživatele z MongoDB
  node scripts/manage-admin-users.js sync                         - Synchronizovat admin_credentials.json → MongoDB

Příklady:
  node scripts/manage-admin-users.js add admin secretpassword123
  node scripts/manage-admin-users.js remove olduser
  node scripts/manage-admin-users.js list
  node scripts/manage-admin-users.js sync

📝 Poznámka:
  • add/remove pracují současně s MongoDB i s admin_credentials.json
  • sync načítá admin_credentials.json a ukládá nové uživatele do MongoDB
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

    case 'sync':
      await syncFromCredentials();
      break;

    default:
      console.error(`❌ Neznámý příkaz: ${command}`);
      console.log('Dostupné příkazy: add, remove, list, sync');
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

module.exports = { addUser, removeUser, listUsers, syncFromCredentials };