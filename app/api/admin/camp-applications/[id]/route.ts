import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import CampApplication from '@/models/CampApplication';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

// GET - Načíst jednu přihlášku
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

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

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    return dbError(error, 'GET /api/admin/camp-applications/[id] error:');
  }
}

// PUT - Aktualizovat přihlášku (schválit/zamítnout)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const user = await getUserFromToken(request);
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

    application.status = status;
    application.adminNotes = adminNotes;
    application.processedBy = user?.username || 'admin';

    if (status !== 'pending') {
      application.processedAt = new Date();
    }

    await application.save();

    return NextResponse.json({
      success: true,
      message: `Přihláška byla ${status === 'approved' ? 'schválena' : status === 'rejected' ? 'zamítnuta' : 'aktualizována'}`,
      data: application
    });
  } catch (error) {
    return dbError(error, 'PUT /api/admin/camp-applications/[id] error:');
  }
}

// DELETE - Smazat přihlášku
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const { id } = await params;
    const application = await CampApplication.findByIdAndDelete(id);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Přihláška nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Přihláška byla smazána' });
  } catch (error) {
    return dbError(error, 'DELETE /api/admin/camp-applications/[id] error:');
  }
}
