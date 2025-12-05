import connectToMongoose from '../lib/mongoose';
import User from '../models/User';
import Event from '../models/Event';
import Article from '../models/Article';

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectToMongoose();
    console.log('✅ Connected to MongoDB');

    // Create initial admin user
    const adminUser = await User.findOne({ email: 'admin@pionyr-pacov.cz' });

    if (!adminUser) {
      const newAdmin = new User({
        name: 'Admin Pionýrské skupiny',
        email: 'admin@pionyr-pacov.cz',
        role: 'admin',
        membershipStatus: 'active',
        joinDate: new Date(),
      });

      await newAdmin.save();
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create sample events
    const eventCount = await Event.countDocuments();

    if (eventCount === 0) {
      const admin = await User.findOne({ email: 'admin@pionyr-pacov.cz' });

      const sampleEvents = [
        {
          title: 'Schůzka pionýrského oddílu',
          description: 'Pravidelná schůzka pro všechny členy oddílu',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // +2 hours
          location: 'Klubovna Pacov',
          type: 'meeting' as const,
          organizer: admin!._id,
          status: 'planned' as const,
          ageGroup: { min: 8, max: 15 },
        },
        {
          title: 'Letní tábor 2025',
          description: 'Týdenní letní tábor pro děti a mládež',
          startDate: new Date('2025-07-15'),
          endDate: new Date('2025-07-22'),
          location: 'Hájenka Bělá',
          type: 'camp' as const,
          organizer: admin!._id,
          status: 'planned' as const,
          maxParticipants: 30,
          price: 2500,
          ageGroup: { min: 8, max: 16 },
        },
      ];

      await Event.insertMany(sampleEvents);
      console.log('✅ Sample events created');
    } else {
      console.log('ℹ️ Events already exist');
    }

    // Create sample articles
    const articleCount = await Article.countDocuments();

    if (articleCount === 0) {
      const admin = await User.findOne({ email: 'admin@pionyr-pacov.cz' });

      const sampleArticles = [
        {
          title: 'Vítejte na nových webových stránkách',
          slug: 'vitejte-na-novych-strankaoch',
          content: 'Jsme rádi, že můžeme představit naše nové webové stránky...',
          excerpt: 'Představujeme naše nové webové stránky s moderním designem a funkcionalitou.',
          author: admin!._id,
          category: 'announcement' as const,
          tags: ['web', 'novinky'],
          status: 'published' as const,
        },
        {
          title: 'Jak probíhal letní tábor 2024',
          slug: 'letni-tabor-2024-reportaz',
          content: 'Letošní letní tábor byl opět skvělým zážitkem...',
          excerpt: 'Reportáž z letního tábora 2024 plná fotek a zážitků.',
          author: admin!._id,
          category: 'event-report' as const,
          tags: ['tábor', '2024', 'reportáž'],
          status: 'published' as const,
        },
      ];

      await Article.insertMany(sampleArticles);
      console.log('✅ Sample articles created');
    } else {
      console.log('ℹ️ Articles already exist');
    }

    console.log('🎉 Database initialization completed successfully!');

    // Display summary
    const userCount = await User.countDocuments();
    const eventCount2 = await Event.countDocuments();
    const articleCount2 = await Article.countDocuments();

    console.log('📊 Database summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Events: ${eventCount2}`);
    console.log(`   Articles: ${articleCount2}`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Init script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Init script failed:', error);
      process.exit(1);
    });
}

export default initializeDatabase;