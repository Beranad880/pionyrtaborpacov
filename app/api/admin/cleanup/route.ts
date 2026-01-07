import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import mongoose from 'mongoose';

// Active collections that should be kept
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

// POST - Clean up unused collections
export async function POST(request: NextRequest) {
  try {
    await connectToMongoose();

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database connection not available' },
        { status: 500 }
      );
    }

    const results = {
      migrated: 0,
      dropped: [] as string[],
      errors: [] as string[]
    };

    // Migrate SimpleAdminUsers to AdminUsers if needed
    try {
      const simpleAdminCollection = db.collection('simpleadminusers');
      const adminCollection = db.collection('adminusers');

      const simpleUsersCount = await simpleAdminCollection.countDocuments();
      if (simpleUsersCount > 0) {
        const simpleUsers = await simpleAdminCollection.find({}).toArray();

        for (const user of simpleUsers) {
          // Check if user already exists in adminusers
          const existingUser = await adminCollection.findOne({ username: user.username });

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

            await adminCollection.insertOne(migratedUser);
            results.migrated++;
          }
        }
      }
    } catch (error: any) {
      results.errors.push(`Migration error: ${error.message}`);
    }

    // Remove unused collections
    for (const collectionName of COLLECTIONS_TO_REMOVE) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();

        if (count > 0) {
          await collection.drop();
          results.dropped.push(collectionName);
        }
      } catch (error: any) {
        if (error.codeName !== 'NamespaceNotFound') {
          results.errors.push(`Error dropping ${collectionName}: ${error.message}`);
        }
      }
    }

    // Get final collection list
    const collections = await db.listCollections().toArray();
    const finalCollections = collections.map(c => c.name);

    return NextResponse.json({
      success: true,
      message: 'Database cleanup completed',
      results: {
        ...results,
        remainingCollections: finalCollections.filter(name => ACTIVE_COLLECTIONS.includes(name))
      }
    });

  } catch (error: any) {
    console.error('Database cleanup error:', error);
    return NextResponse.json(
      { success: false, message: 'Cleanup failed', error: error.message },
      { status: 500 }
    );
  }
}

// GET - Check collections status
export async function GET(request: NextRequest) {
  try {
    await connectToMongoose();

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database connection not available' },
        { status: 500 }
      );
    }

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    const analysis = {
      total: collections.length,
      active: collectionNames.filter(name => ACTIVE_COLLECTIONS.includes(name)),
      toRemove: collectionNames.filter(name => COLLECTIONS_TO_REMOVE.includes(name)),
      unknown: collectionNames.filter(name =>
        !ACTIVE_COLLECTIONS.includes(name) &&
        !COLLECTIONS_TO_REMOVE.includes(name)
      )
    };

    // Get document counts for collections to remove
    const collectionCounts: { [key: string]: number } = {};
    for (const name of analysis.toRemove) {
      try {
        const count = await db.collection(name).countDocuments();
        collectionCounts[name] = count;
      } catch (error) {
        collectionCounts[name] = 0;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        collectionCounts,
        needsCleanup: analysis.toRemove.length > 0
      }
    });

  } catch (error: any) {
    console.error('Collections check error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check collections', error: error.message },
      { status: 500 }
    );
  }
}