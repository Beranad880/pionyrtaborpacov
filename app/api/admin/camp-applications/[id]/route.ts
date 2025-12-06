import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import CampApplication from '@/models/CampApplication';
import AdminUser from '@/models/AdminUser';

// Utility function pro ověření autentifikace
async function verifyAuthentication(request: NextRequest) {
  const authCookie = request.cookies.get('admin_auth');

  if (!authCookie) {
    return null;
  }

  try {
    // Dekódovat auth token
    const decoded = Buffer.from(authCookie.value, 'base64').toString('utf-8');
    const [userId, username, timestamp] = decoded.split(':');

    if (!userId || !username || !timestamp) {
      return null;
    }

    // Kontrola platnosti (7 dní)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dní v milisekundách

    if (tokenAge > maxAge) {
      return null;
    }

    // Ověření existence uživatele
    const user = await AdminUser.findById(userId);

    if (!user || user.username !== username) {
      return null;
    }

    return {
      id: user._id,
      username: user.username,
      email: username // Použijeme username jako email pro kompatibilitu
    };
  } catch (error) {
    return null;
  }
}

// GET - Načíst jednu přihlášku
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongoose();

    const { id } = await params;
    const application = await CampApplication.findById(id).lean();

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Přihláška nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application
    });
  } catch (error: any) {
    console.error('GET /api/admin/camp-applications/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Nepodařilo se načíst přihlášku', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat přihlášku (schválit/zamítnout)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongoose();

    // Ověření autentifikace
    const user = await verifyAuthentication(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Neautorizovaný přístup' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, adminNotes } = body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Neplatný status' },
        { status: 400 }
      );
    }

    const { id } = await params;
    const application = await CampApplication.findById(id);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Přihláška nebyla nalezena' },
        { status: 404 }
      );
    }

    // Aktualizace přihlášky
    application.status = status;
    application.adminNotes = adminNotes;
    application.processedBy = user.username;

    if (status !== 'pending') {
      application.processedAt = new Date();
    }

    await application.save();

    return NextResponse.json({
      success: true,
      message: `Přihláška byla ${status === 'approved' ? 'schválena' : status === 'rejected' ? 'zamítnuta' : 'aktualizována'}`,
      data: application
    });
  } catch (error: any) {
    console.error('PUT /api/admin/camp-applications/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Nepodařilo se aktualizovat přihlášku', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Smazat přihlášku
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongoose();

    // Ověření autentifikace
    const user = await verifyAuthentication(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Neautorizovaný přístup' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const application = await CampApplication.findByIdAndDelete(id);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Přihláška nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Přihláška byla smazána'
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/camp-applications/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Nepodařilo se smazat přihlášku', error: error.message },
      { status: 500 }
    );
  }
}