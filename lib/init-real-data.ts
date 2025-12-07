import connectToMongoose from './mongoose';
import PioneerGroup from '@/models/PioneerGroup';
import Facility from '@/models/Facility';
import PageContent from '@/models/PageContent';
import Article from '@/models/Article';
import AdminUser from '@/models/AdminUser';
import CampApplication from '@/models/CampApplication';
import RentalRequest from '@/models/RentalRequest';
import { allPagesContent, siteData } from '@/data/content';
import fs from 'fs';
import path from 'path';

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

    // 2. Initialize Facilities (Hájenka Bělá)
    await initializeFacilities();

    // 3. Initialize Page Contents
    await initializePageContents();

    // 4. Initialize Articles
    await initializeArticles();

    // 5. Initialize Admin Users
    await initializeAdminUsers();

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

async function initializeArticles() {
  const existingArticles = await Article.countDocuments();

  if (existingArticles === 0) {
    console.log('📝 Creating sample articles...');

    const sampleArticles = [
      {
        title: 'Přípravy na zimní tábor 2024',
        slug: 'pripravy-na-zimni-tabor-2024',
        excerpt: 'Blíží se termín našeho tradičního zimního tábora. Letos se koná od 27. prosince 2024 do 2. ledna 2025 na Hájence Bělá. Program je plný her, sportovních aktivit a táborového dobrodružství.',
        content: '<p>Blíží se termín našeho tradičního zimního tábora a přípravy jsou v plném proudu! Letos se zimní tábor koná od <strong>27. prosince 2024 do 2. ledna 2025</strong> na naší oblíbené Hájence Bělá.</p><h2>Program tábora</h2><p>Připravili jsme pro vás bohatý program plný her, sportovních aktivit a táborového dobrodružství. Nebudou chybět ani tradiční táborové ohně, noční hry a mnoho dalších zážitků.</p><h2>Co s sebou</h2><ul><li>Teplé oblečení na zimní podmínky</li><li>Pevnou zimní obuv</li><li>Osobní hygienické potřeby</li><li>Léky (pokud nějaké užíváte)</li></ul><p>Těšíme se na vás!</p>',
        author: 'Vedení skupiny',
        category: 'announcement',
        tags: ['tábor', 'zima', '2024'],
        status: 'published',
        publishedAt: new Date('2024-11-15'),
        views: 124,
        likes: 8
      },
      {
        title: 'Úspěšný letní tábor 2024',
        slug: 'uspesny-letni-tabor-2024',
        excerpt: 'Letní tábor 2024 na Hájence Bělá se vydařil na výbornou. Účastnilo se ho 28 dětí a měli jsme krásné počasí po celou dobu. Děti si užily spoustu her, výletů a táborových aktivit.',
        content: '<p>Letní tábor 2024 na Hájence Bělá se vydařil na výbornou! Od 15. do 29. července se ho účastnilo <strong>28 dětí</strong> ve věku 7-15 let.</p><h2>Highlights tábora</h2><ul><li>Krásné počasí po celou dobu</li><li>Výlet do ZOO Tábor</li><li>Noční hra v lese</li><li>Sportovní olympiáda</li><li>Táborový ples</li></ul><p>Děkujeme všem vedoucím a rodičům za podporu. Fotky z tábora najdete v naší galerii.</p>',
        author: 'Vedení skupiny',
        category: 'event-report',
        tags: ['tábor', 'léto', '2024', 'reportáž'],
        status: 'published',
        publishedAt: new Date('2024-08-15'),
        views: 256,
        likes: 15
      },
      {
        title: 'Rekonstrukce hájenky dokončena',
        slug: 'rekonstrukce-hajenky-dokoncena',
        excerpt: 'Dokončili jsme rozsáhlou rekonstrukci naší hájenky. Nové sociální zařízení, opravené střechy a celkově modernizované zázemí nám poskytne ještě lepší podmínky pro naše aktivity.',
        content: '<p>Po několika měsících náročné práce jsme dokončili rozsáhlou rekonstrukci naší táborové základny Hájenka Bělá.</p><h2>Co jsme opravili</h2><ul><li>Kompletně nové sociální zařízení</li><li>Opravu střech a zateplení</li><li>Modernizaci kuchyně</li><li>Nové topení</li><li>Úpravu okolí</li></ul><p>Díky těmto úpravám můžeme nabídnout ještě lepší podmínky pro naše tábory a akce. Hájenka je nyní připravena na další roky využívání.</p>',
        author: 'Vedení skupiny',
        category: 'news',
        tags: ['hájenka', 'rekonstrukce', 'novinky'],
        status: 'published',
        publishedAt: new Date('2024-05-01'),
        views: 189,
        likes: 12
      },
      {
        title: 'Oslava 10. výročí skupiny',
        slug: 'oslava-10-vyroci-skupiny',
        excerpt: 'Letos slavíme 10 let od založení Pionýrské skupiny Pacov. Během této doby jsme uspořádali desítky táborů, výletů a akcí pro stovky dětí z Pacova a okolí. Děkujeme všem vedoucím a rodičům za podporu!',
        content: '<p>Tento rok je pro naši Pionýrskou skupinu Pacov výjimečný - slavíme <strong>10. výročí</strong> našeho založení!</p><h2>Co jsme za 10 let dokázali</h2><ul><li>Uspořádali jsme 40+ táborů</li><li>Prošlo námi více než 300 dětí</li><li>Zrekonstruovali jsme Hájenku Bělá</li><li>Založili jsme 3 oddíly</li><li>Vychovali jsme desítky mladých vedoucích</li></ul><p>Oslavy výročí proběhnou během celého roku 2024. Děkujeme všem vedoucím, rodičům a dětem, kteří s námi tuto cestu prošli!</p><h2>Pozvánka na oslavu</h2><p>Hlavní oslava se koná <strong>15. června 2024</strong> na Hájence Bělá. Všichni bývalí i současní členové jsou srdečně zváni!</p>',
        author: 'Vedení skupiny',
        category: 'announcement',
        tags: ['výročí', '10 let', 'oslava'],
        status: 'published',
        publishedAt: new Date('2024-01-01'),
        views: 342,
        likes: 24
      },
      {
        title: 'Nový článek v přípravě',
        slug: 'novy-clanek-v-priprave',
        excerpt: 'Toto je ukázkový článek v režimu konceptu. Můžete ho použít pro testování admin rozhraní.',
        content: '<p>Toto je obsah článku, který je zatím pouze v konceptu. Můžete ho upravit nebo publikovat pomocí admin rozhraní.</p>',
        author: 'Admin',
        category: 'general',
        tags: ['test', 'koncept'],
        status: 'draft',
        views: 0,
        likes: 0
      }
    ];

    await Article.insertMany(sampleArticles);
    console.log(`✅ Created ${sampleArticles.length} sample articles`);
  } else {
    console.log(`ℹ️ Found ${existingArticles} existing articles, skipping`);
  }
}

async function initializeAdminUsers() {
  const existingAdminUsers = await AdminUser.countDocuments();

  if (existingAdminUsers === 0) {
    console.log('📝 Initializing admin users...');

    // First try to load from admin_credentials.json
    const credentialsPath = path.join(process.cwd(), 'admin_credentials.json');
    let adminsFromJson: Array<{username: string, password: string}> = [];

    if (fs.existsSync(credentialsPath)) {
      try {
        console.log('📂 Found admin_credentials.json, loading admin users...');
        const fileContent = fs.readFileSync(credentialsPath, 'utf8');
        const adminData = JSON.parse(fileContent);

        // Support different JSON formats
        if (Array.isArray(adminData)) {
          adminsFromJson = adminData;
        } else if (adminData.admins && Array.isArray(adminData.admins)) {
          adminsFromJson = adminData.admins;
        } else if (adminData.username && adminData.password) {
          adminsFromJson = [adminData];
        }

        if (adminsFromJson.length > 0) {
          console.log(`🔍 Found ${adminsFromJson.length} admin users in JSON file`);

          let created = 0;
          for (const adminInfo of adminsFromJson) {
            try {
              // Validation
              if (!adminInfo.username || !adminInfo.password) continue;
              if (adminInfo.username.length < 3 || adminInfo.password.length < 6) continue;

              // Create admin user using the AdminUser model (with automatic hashing)
              const user = new AdminUser({
                username: adminInfo.username,
                password: adminInfo.password,
                role: 'admin',
                isActive: true
              });
              await user.save();

              console.log(`   ✅ Created admin user: ${adminInfo.username}`);
              created++;

            } catch (error: any) {
              console.log(`   ⚠️ Failed to create ${adminInfo.username}: ${error.message}`);
            }
          }

          if (created > 0) {
            console.log(`✅ Created ${created} admin users from admin_credentials.json`);
            return;
          }
        }
      } catch (error) {
        console.log('⚠️ Failed to parse admin_credentials.json, falling back to default admin');
      }
    }

    // Fallback: create default admin user if no JSON file or no valid users
    console.log('📝 Creating default admin user...');

    const user = new AdminUser({
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    await user.save();

    console.log('✅ Created default admin user');
    console.log('⚠️  Default login: admin / admin123');
    console.log('⚠️  Please change the password after first login!');

  } else {
    console.log(`ℹ️ Found ${existingAdminUsers} existing admin users, skipping`);
  }
}

async function printCollectionSummary() {
  const pioneerGroups = await PioneerGroup.countDocuments();
  const facilities = await Facility.countDocuments();
  const pageContents = await PageContent.countDocuments();
  const articles = await Article.countDocuments();
  const adminUsers = await AdminUser.countDocuments();
  const campApplications = await CampApplication.countDocuments();
  const rentalRequests = await RentalRequest.countDocuments();

  console.log('📊 Database Collections Summary:');
  console.log(`   Pioneer Groups: ${pioneerGroups}`);
  console.log(`   Facilities: ${facilities}`);
  console.log(`   Page Contents: ${pageContents}`);
  console.log(`   Articles: ${articles}`);
  console.log(`   Admin Users: ${adminUsers}`);
  console.log(`   Camp Applications: ${campApplications}`);
  console.log(`   Rental Requests: ${rentalRequests}`);
}

export async function resetAllCollections() {
  try {
    await connectToMongoose();

    console.log('🗑️ Clearing all data collections...');

    await Promise.all([
      PioneerGroup.deleteMany({}),
      Facility.deleteMany({}),
      PageContent.deleteMany({}),
      Article.deleteMany({}),
      AdminUser.deleteMany({}),
      CampApplication.deleteMany({}),
      RentalRequest.deleteMany({}),
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