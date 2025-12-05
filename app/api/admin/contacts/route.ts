import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Contact from '@/models/Contact';

// GET - Získat aktivní kontaktní informace
export async function GET() {
  try {
    await connectToMongoose();
    const contact = await Contact.findOne({ isActive: true });

    return NextResponse.json({
      success: true,
      data: contact
    });
  } catch (error: any) {
    console.error('GET /api/admin/contacts error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch contact information',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// POST - Vytvořit nové kontaktní informace
export async function POST(request: NextRequest) {
  try {
    await connectToMongoose();
    const body = await request.json();

    // Deaktivovat stávající aktivní kontakt
    await Contact.updateMany({ isActive: true }, { isActive: false });

    const contact = new Contact(body);
    await contact.save();

    return NextResponse.json({
      success: true,
      data: contact,
      message: 'Contact information created successfully'
    });
  } catch (error: any) {
    console.error('POST /api/admin/contacts error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create contact information',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat kontaktní informace
export async function PUT(request: NextRequest) {
  try {
    await connectToMongoose();
    const body = await request.json();
    const { _id, ...updateData } = body;

    const contact = await Contact.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contact not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contact,
      message: 'Contact information updated successfully'
    });
  } catch (error: any) {
    console.error('PUT /api/admin/contacts error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update contact information',
        error: error.message
      },
      { status: 500 }
    );
  }
}