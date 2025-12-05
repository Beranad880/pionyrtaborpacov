import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import User from '@/models/User';
import Event from '@/models/Event';
import Article from '@/models/Article';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToMongoose();

    // Test creating a test user
    const testUser = new User({
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      role: 'member',
      membershipStatus: 'active',
    });

    await testUser.save();

    // Test creating a test event
    const testEvent = new Event({
      title: 'Test Event',
      description: 'This is a test event',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000), // Tomorrow
      type: 'meeting',
      organizer: testUser._id,
      status: 'planned',
    });

    await testEvent.save();

    // Test creating a test article
    const testArticle = new Article({
      title: 'Test Article',
      slug: `test-article-${Date.now()}`,
      content: 'This is test article content',
      excerpt: 'This is a test article excerpt',
      author: testUser._id,
      category: 'news',
      status: 'published',
    });

    await testArticle.save();

    // Get counts
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    const articleCount = await Article.countDocuments();

    // Clean up test data (optional)
    await User.findByIdAndDelete(testUser._id);
    await Event.findByIdAndDelete(testEvent._id);
    await Article.findByIdAndDelete(testArticle._id);

    return NextResponse.json({
      success: true,
      message: 'Models test successful',
      data: {
        userCount,
        eventCount,
        articleCount,
        testResults: {
          userCreated: !!testUser._id,
          eventCreated: !!testEvent._id,
          articleCreated: !!testArticle._id,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Models test error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Models test failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}