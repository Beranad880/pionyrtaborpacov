import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Article from '@/models/Article';
import Content from '@/models/Content';
import AdminUser from '@/models/AdminUser';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    console.log('Debug action:', action);

    // Test MongoDB connection
    await connectToMongoose();
    console.log('✅ MongoDB connection successful');

    switch (action) {
      case 'test-article-create':
        return await testArticleCreate();
      case 'test-content-create':
        return await testContentCreate();
      case 'test-admin-user-create':
        return await testAdminUserCreate();
      case 'create-default-admin':
        return await createDefaultAdmin();
      case 'check-collections':
        return await checkCollections();
      case 'check-admin':
        return await checkAdmin();
      case 'test-login':
        return await testLogin();
      default:
        return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Debug test failed',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

async function testArticleCreate() {
  try {
    const testArticle = {
      title: 'Test článek - ' + Date.now(),
      slug: 'test-clanek-' + Date.now(),
      excerpt: 'Testovací článek pro debug.',
      content: '<p>Obsah testovacího článku.</p>',
      author: 'Debug Test',
      category: 'general',
      tags: ['test'],
      status: 'draft'
    };

    console.log('Creating test article:', testArticle);

    const article = new Article(testArticle);
    await article.validate();
    console.log('✅ Article validation passed');

    const savedArticle = await article.save();
    console.log('✅ Article saved successfully:', savedArticle._id);

    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      data: savedArticle
    });
  } catch (error: any) {
    console.error('❌ Article creation failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Article creation failed',
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : null
    }, { status: 500 });
  }
}

async function testContentCreate() {
  try {
    const testContent = {
      page: 'test-page-' + Date.now(),
      content: {
        title: 'Test Content',
        description: 'Test content for debug'
      },
      modifiedBy: 'debug-test'
    };

    console.log('Creating test content:', testContent);

    const content = new Content(testContent);
    await content.validate();
    console.log('✅ Content validation passed');

    const savedContent = await content.save();
    console.log('✅ Content saved successfully:', savedContent._id);

    return NextResponse.json({
      success: true,
      message: 'Content created successfully',
      data: savedContent
    });
  } catch (error: any) {
    console.error('❌ Content creation failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Content creation failed',
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : null
    }, { status: 500 });
  }
}

async function testAdminUserCreate() {
  try {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('test123', 12);

    const testUser = {
      username: 'test-user-' + Date.now(),
      password: hashedPassword
    };

    console.log('Creating test admin user:', { username: testUser.username });

    const user = new AdminUser(testUser);
    await user.validate();
    console.log('✅ AdminUser validation passed');

    const savedUser = await user.save();
    console.log('✅ AdminUser saved successfully:', savedUser._id);

    return NextResponse.json({
      success: true,
      message: 'AdminUser created successfully',
      data: { _id: savedUser._id, username: savedUser.username, createdAt: savedUser.createdAt }
    });
  } catch (error: any) {
    console.error('❌ AdminUser creation failed:', error);
    return NextResponse.json({
      success: false,
      message: 'AdminUser creation failed',
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : null
    }, { status: 500 });
  }
}


async function createDefaultAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ username: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
        data: { username: 'admin' }
      });
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const adminUser = {
      username: 'admin',
      password: hashedPassword
    };

    console.log('Creating default admin user...');

    const user = new AdminUser(adminUser);
    const savedUser = await user.save();

    console.log('✅ Default admin user created:', savedUser._id);

    return NextResponse.json({
      success: true,
      message: 'Default admin user created successfully',
      data: {
        _id: savedUser._id,
        username: savedUser.username,
        createdAt: savedUser.createdAt,
        credentials: 'admin / admin123'
      }
    });
  } catch (error: any) {
    console.error('❌ Default admin creation failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Default admin creation failed',
      error: error.message
    }, { status: 500 });
  }
}

async function checkCollections() {
  try {
    const articleCount = await Article.countDocuments();
    const contentCount = await Content.countDocuments();
    const adminUserCount = await AdminUser.countDocuments();

    console.log('Collection counts:', { articleCount, contentCount, adminUserCount });

    // Get sample documents
    const sampleArticle = await Article.findOne().lean();
    const sampleContent = await Content.findOne().lean();
    const sampleAdminUser = await AdminUser.findOne().lean();

    return NextResponse.json({
      success: true,
      message: 'Collections checked successfully',
      data: {
        counts: {
          articles: articleCount,
          content: contentCount,
          adminUsers: adminUserCount
        },
        samples: {
          article: sampleArticle ? { _id: sampleArticle._id, title: sampleArticle.title } : null,
          content: sampleContent ? { _id: sampleContent._id, page: sampleContent.page } : null,
          adminUser: sampleAdminUser ? { _id: sampleAdminUser._id, username: sampleAdminUser.username } : null
        }
      }
    });
  } catch (error: any) {
    console.error('❌ Collection check failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Collection check failed',
      error: error.message
    }, { status: 500 });
  }
}

async function checkAdmin() {
  try {
    // Check if admin exists in AdminUser
    const adminUser = await AdminUser.findOne({ username: 'admin' }).lean();

    if (adminUser) {
      return NextResponse.json({
        success: true,
        message: 'Admin user found',
        data: {
          _id: adminUser._id,
          username: adminUser.username,
          createdAt: adminUser.createdAt,
          hasPassword: !!adminUser.password
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Admin user not found'
      });
    }
  } catch (error: any) {
    console.error('❌ Admin check failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Admin check failed',
      error: error.message
    }, { status: 500 });
  }
}

async function testLogin() {
  try {
    // Simulate login process
    const username = 'admin';
    const password = 'admin123';

    console.log('Testing login for:', username);

    // Find user
    const userDoc = await AdminUser.findOne({ username }).lean();

    if (!userDoc) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        debug: { username, searched: 'AdminUser' }
      });
    }

    console.log('User found:', userDoc.username, 'Password length:', userDoc.password?.length);

    // Test password comparison
    const bcrypt = require('bcrypt');
    const isPasswordValid = await bcrypt.compare(password, userDoc.password);

    console.log('Password comparison result:', isPasswordValid);

    return NextResponse.json({
      success: isPasswordValid,
      message: isPasswordValid ? 'Login would succeed' : 'Password mismatch',
      data: {
        userFound: true,
        username: userDoc.username,
        userId: userDoc._id,
        passwordCheck: isPasswordValid,
        passwordLength: userDoc.password?.length
      }
    });

  } catch (error: any) {
    console.error('❌ Login test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Login test failed',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Debug API is working',
    availableActions: [
      'test-article-create',
      'test-content-create',
      'test-admin-user-create',
      'check-collections'
    ]
  });
}