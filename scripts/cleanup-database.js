#!/usr/bin/env node

/**
 * Database Cleanup Script
 * Removes unused collections and consolidates admin users
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

// Collections to keep (active models)
const ACTIVE_COLLECTIONS = [
  'adminusers',        // AdminUser (consolidated)
  'articles',          // Article
  'campapplications',  // CampApplication
  'events',           // Event
  'facilities',       // Facility
  'pagecontents',     // PageContent
  'photogalleries',   // PhotoGallery
  'pioneergroups',    // PioneerGroup
  'rentals',          // Rental
  'rentalrequests',   // RentalRequest
];

// Collections to remove (unused models)
const COLLECTIONS_TO_REMOVE = [
  'simpleadminusers', // SimpleAdminUser (consolidated into AdminUser)
  'contacts',         // Contact (removed model)
  'statistics',       // Statistics (removed model)
  'users',           // User (removed model)
  'contents',        // Old Content model
];

async function cleanupDatabase() {
  let client;

  try {
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    console.log(`✅ Connected to database: ${db.databaseName}`);

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📊 Current collections:');
    collections.forEach(col => {
      const status = ACTIVE_COLLECTIONS.includes(col.name) ? '✅ KEEP' :
                     COLLECTIONS_TO_REMOVE.includes(col.name) ? '❌ REMOVE' : '❓ UNKNOWN';
      console.log(`   ${col.name} - ${status}`);
    });

    // Migrate SimpleAdminUsers to AdminUsers if needed
    const simpleAdminUsers = db.collection('simpleadminusers');
    const adminUsers = db.collection('adminusers');

    const simpleUsersCount = await simpleAdminUsers.countDocuments();
    if (simpleUsersCount > 0) {
      console.log(`\n🔄 Migrating ${simpleUsersCount} users from simpleadminusers to adminusers...`);

      const simpleUsers = await simpleAdminUsers.find({}).toArray();

      for (const user of simpleUsers) {
        // Check if user already exists in adminusers
        const existingUser = await adminUsers.findOne({ username: user.username });

        if (!existingUser) {
          // Migrate user with updated structure
          const migratedUser = {
            username: user.username,
            password: user.password,
            email: user.email || null,
            role: user.role || 'admin',
            isActive: user.isActive !== false,
            lastLogin: user.lastLogin || null,
            createdBy: user.createdBy || 'migration',
            createdAt: user.createdAt || new Date(),
            updatedAt: user.updatedAt || new Date()
          };

          await adminUsers.insertOne(migratedUser);
          console.log(`   ✅ Migrated user: ${user.username}`);
        } else {
          console.log(`   ⚠️ User ${user.username} already exists in adminusers, skipping`);
        }
      }
    }

    // Remove unused collections
    console.log('\n🗑️ Removing unused collections...');
    for (const collectionName of COLLECTIONS_TO_REMOVE) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();

        if (count > 0) {
          console.log(`   Dropping ${collectionName} (${count} documents)...`);
          await collection.drop();
          console.log(`   ✅ Dropped ${collectionName}`);
        } else {
          console.log(`   ℹ️ ${collectionName} is empty or doesn't exist`);
        }
      } catch (error) {
        if (error.codeName === 'NamespaceNotFound') {
          console.log(`   ℹ️ ${collectionName} doesn't exist`);
        } else {
          console.log(`   ⚠️ Error dropping ${collectionName}: ${error.message}`);
        }
      }
    }

    // Final summary
    console.log('\n📊 Final collections summary:');
    const finalCollections = await db.listCollections().toArray();
    finalCollections.forEach(col => {
      console.log(`   ✅ ${col.name}`);
    });

    // Count documents in active collections
    console.log('\n📈 Document counts:');
    for (const collectionName of ACTIVE_COLLECTIONS) {
      try {
        const count = await db.collection(collectionName).countDocuments();
        if (count > 0) {
          console.log(`   ${collectionName}: ${count} documents`);
        }
      } catch (error) {
        // Collection doesn't exist yet, which is fine
      }
    }

    console.log('\n✅ Database cleanup completed!');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the cleanup
cleanupDatabase();