import connectToMongoose from './mongoose';
import PioneerGroup from '@/models/PioneerGroup';
import Contact from '@/models/Contact';
import Facility from '@/models/Facility';
import Statistics from '@/models/Statistics';
import PageContent from '@/models/PageContent';
import { allPagesContent, siteData } from '@/data/content';

let isInitialized = false;

export async function initializeRealDataCollections() {
  if (isInitialized) {
    return;
  }

  try {
    console.log('🚀 Initializing real data collections...');

    await connectToMongoose();
    console.log('✅ Connected to MongoDB');

    // 1. Initialize Pioneer Groups
    await initializePioneerGroups();

    // 2. Initialize Contact Information
    await initializeContact();

    // 3. Initialize Facilities (Hájenka Bělá)
    await initializeFacilities();

    // 4. Initialize Statistics
    await initializeStatistics();

    // 5. Initialize Page Contents
    await initializePageContents();

    // Print summary
    await printCollectionSummary();

    isInitialized = true;
    console.log('🎉 All data collections initialized successfully!');

  } catch (error) {
    console.error('❌ Failed to initialize data collections:', error);
    throw error;
  }
}

async function initializePioneerGroups() {
  const existingGroups = await PioneerGroup.countDocuments();

  if (existingGroups === 0) {
    console.log('📝 Creating pioneer groups...');

    const groups = allPagesContent.pioneerGroups.groups.map((group: any) => ({
      name: group.name,
      ageRange: group.ageRange,
      description: group.description,
      activities: group.activities,
      currentMembers: Math.floor(Math.random() * 15) + 5, // Random 5-20 members
      isActive: true,
    }));

    await PioneerGroup.insertMany(groups);
    console.log(`✅ Created ${groups.length} pioneer groups`);
  } else {
    console.log(`ℹ️ Found ${existingGroups} existing pioneer groups, skipping`);
  }
}

async function initializeContact() {
  const existingContact = await Contact.countDocuments({ isActive: true });

  if (existingContact === 0) {
    console.log('📝 Creating contact information...');

    const contact = {
      organizationName: siteData.title,
      description: siteData.description,
      email: siteData.contact.email,
      phone: siteData.contact.phone,
      address: siteData.contact.address,
      bankAccount: siteData.contact.bankAccount,
      ico: siteData.contact.ico,
      dic: siteData.contact.dic,
      socialMedia: {
        facebook: siteData.social.facebook,
        instagram: siteData.social.instagram,
      },
      leadership: {
        leader: siteData.leadership.leader,
        treasurer: siteData.leadership.treasurer,
        auditor: siteData.leadership.auditor,
        delegates: siteData.leadership.delegates,
      },
      isActive: true,
    };

    await Contact.create(contact);
    console.log('✅ Created contact information');
  } else {
    console.log('ℹ️ Contact information already exists, skipping');
  }
}

async function initializeFacilities() {
  const existingFacilities = await Facility.countDocuments();

  if (existingFacilities === 0) {
    console.log('📝 Creating facilities...');

    const facilities = [
      {
        name: allPagesContent.hajenkaBela.title,
        type: 'camp' as const,
        description: allPagesContent.hajenkaBela.description,
        details: allPagesContent.hajenkaBela.details,
        location: {
          gps: allPagesContent.hajenkaBela.location.gps,
          nearestTown: allPagesContent.hajenkaBela.location.nearestTown,
          description: allPagesContent.hajenkaBela.location.description,
        },
        equipment: allPagesContent.hajenkaBela.equipment,
        activities: allPagesContent.hajenkaBela.activities,
        capacity: 30,
        images: [allPagesContent.hajenkaBela.images.exterior],
        contact: {
          email: siteData.contact.email,
          phone: siteData.contact.phone,
          person: siteData.leadership.leader,
        },
        rental: {
          isAvailable: true,
          pricePerDay: 1000,
          pricePerWeek: 6000,
          rules: allPagesContent.rentalHajenkaBela.pricing.rules,
          bookingSteps: allPagesContent.rentalHajenkaBela.booking.steps,
        },
        isActive: true,
      }
    ];

    await Facility.insertMany(facilities);
    console.log(`✅ Created ${facilities.length} facilities`);
  } else {
    console.log(`ℹ️ Found ${existingFacilities} existing facilities, skipping`);
  }
}

async function initializeStatistics() {
  const currentYear = new Date().getFullYear();
  const existingStats = await Statistics.findOne({ year: currentYear });

  if (!existingStats) {
    console.log(`📝 Creating statistics for year ${currentYear}...`);

    const stats = {
      year: currentYear,
      ageGroups: siteData.statistics.ageGroups,
      totalMembers: siteData.statistics.total,
      councilMembers: siteData.statistics.councilMembers,
      leadershipMembers: siteData.statistics.leadershipMembers,
      krpDelegates: siteData.statistics.krpDelegates,
      foundedGroups: siteData.statistics.foundedGroups,
      activeGroups: 3,
      events: {
        meetings: 48, // Weekly meetings
        camps: 4,
        trips: 12,
        workshops: 6,
      },
      financial: {
        budget: 250000,
        expenses: 180000,
        income: 220000,
      },
      notes: `Statistiky pro rok ${currentYear} - automaticky vygenerováno`,
      isActive: true,
    };

    await Statistics.create(stats);
    console.log(`✅ Created statistics for year ${currentYear}`);
  } else {
    console.log(`ℹ️ Statistics for year ${currentYear} already exist, skipping`);
  }
}

async function initializePageContents() {
  const existingPages = await PageContent.countDocuments();

  if (existingPages === 0) {
    console.log('📝 Creating page contents...');

    const pages = [
      {
        pageId: 'home',
        title: 'Úvodní stránka',
        sections: [
          {
            id: 'hero',
            title: 'Hero sekce',
            content: allPagesContent.home.hero,
            order: 1,
            isVisible: true,
          },
          {
            id: 'about',
            title: 'O nás',
            content: allPagesContent.home.about,
            order: 2,
            isVisible: true,
          },
          {
            id: 'pioneer',
            title: 'Pionýr',
            content: allPagesContent.home.pioneer,
            order: 3,
            isVisible: true,
          },
          {
            id: 'history',
            title: 'Historie',
            content: allPagesContent.home.history,
            order: 4,
            isVisible: true,
          },
        ],
        metadata: {
          description: 'Úvodní stránka Pionýrské skupiny Pacov',
          keywords: ['pionýr', 'pacov', 'děti', 'mládež'],
          lastModified: new Date(),
          modifiedBy: 'system-init',
        },
        isActive: true,
      },
      {
        pageId: 'calendar',
        title: 'Kalendář akcí',
        sections: [
          {
            id: 'main',
            title: 'Kalendář',
            content: allPagesContent.calendar,
            order: 1,
            isVisible: true,
          },
        ],
        metadata: {
          description: 'Kalendář akcí a události Pionýrské skupiny Pacov',
          keywords: ['kalendář', 'akce', 'události', 'tábory'],
          lastModified: new Date(),
          modifiedBy: 'system-init',
        },
        isActive: true,
      },
      {
        pageId: 'articles',
        title: 'Články a novinky',
        sections: [
          {
            id: 'main',
            title: 'Články',
            content: allPagesContent.articles,
            order: 1,
            isVisible: true,
          },
        ],
        metadata: {
          description: 'Články a novinky z života Pionýrské skupiny Pacov',
          keywords: ['články', 'novinky', 'reportáže'],
          lastModified: new Date(),
          modifiedBy: 'system-init',
        },
        isActive: true,
      },
      {
        pageId: 'photos',
        title: 'Fotky z akcí',
        sections: [
          {
            id: 'main',
            title: 'Fotogalerie',
            content: allPagesContent.photos,
            order: 1,
            isVisible: true,
          },
        ],
        metadata: {
          description: 'Fotografie z akcí a táborů Pionýrské skupiny Pacov',
          keywords: ['fotky', 'galerie', 'tábory', 'akce'],
          lastModified: new Date(),
          modifiedBy: 'system-init',
        },
        isActive: true,
      },
    ];

    await PageContent.insertMany(pages);
    console.log(`✅ Created ${pages.length} page contents`);
  } else {
    console.log(`ℹ️ Found ${existingPages} existing page contents, skipping`);
  }
}

async function printCollectionSummary() {
  const pioneerGroups = await PioneerGroup.countDocuments();
  const contacts = await Contact.countDocuments();
  const facilities = await Facility.countDocuments();
  const statistics = await Statistics.countDocuments();
  const pageContents = await PageContent.countDocuments();

  console.log('📊 Database Collections Summary:');
  console.log(`   Pioneer Groups: ${pioneerGroups}`);
  console.log(`   Contacts: ${contacts}`);
  console.log(`   Facilities: ${facilities}`);
  console.log(`   Statistics: ${statistics}`);
  console.log(`   Page Contents: ${pageContents}`);
}

export async function resetAllCollections() {
  try {
    await connectToMongoose();

    console.log('🗑️ Clearing all data collections...');

    await Promise.all([
      PioneerGroup.deleteMany({}),
      Contact.deleteMany({}),
      Facility.deleteMany({}),
      Statistics.deleteMany({}),
      PageContent.deleteMany({}),
    ]);

    console.log('✅ All collections cleared');

    isInitialized = false;
    await initializeRealDataCollections();

    console.log('🔄 All collections reset and reinitialized!');
  } catch (error) {
    console.error('❌ Failed to reset collections:', error);
    throw error;
  }
}