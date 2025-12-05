import { initializeRealDataCollections, resetAllCollections } from './init-real-data';

export async function autoInitializeDatabase() {
  try {
    await initializeRealDataCollections();
  } catch (error) {
    console.error('❌ Auto-initialization failed:', error);
    // Ne-throw error, aby aplikace mohla pokračovat bez databáze
  }
}

export async function resetDatabase() {
  try {
    await resetAllCollections();
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  }
}