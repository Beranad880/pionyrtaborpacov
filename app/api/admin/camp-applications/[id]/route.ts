import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import CampApplication from '@/models/CampApplication';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';
import { logAction } from '@/lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const { id } = await params;
    const application = await CampApplication.findOne({ _id: id, isDeleted: { $ne: true } }).lean();

    if (!application) {
      return NextResponse.json({ success: false, message: 'Přihláška nebyla nalezena' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    return dbError(error, 'GET /api/admin/camp-applications/[id] error:');
  }
}

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
      return NextResponse.json({ success: false, message: 'Neplatný status' }, { status: 400 });
    }

    const { id } = await params;
    const application = await CampApplication.findOne({ _id: id, isDeleted: { $ne: true } });

    if (!application) {
      return NextResponse.json({ success: false, message: 'Přihláška nebyla nalezena' }, { status: 404 });
    }

    application.status = status;
    application.adminNotes = adminNotes;
    application.processedBy = user?.username || 'admin';
    if (status !== 'pending') application.processedAt = new Date();

    await application.save();

    const actionLabel = status === 'approved' ? 'schválena' : status === 'rejected' ? 'zamítnuta' : 'aktualizována';
    logAction({
      action: `Přihláška ${actionLabel}`,
      entity: 'camp-application',
      entityId: id,
      entityTitle: application.participantName,
      user: user?.username || 'admin',
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Přihláška byla ${actionLabel}`,
      data: application
    });
  } catch (error) {
    return dbError(error, 'PUT /api/admin/camp-applications/[id] error:');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();
    const user = await getUserFromToken(request);
    const { id } = await params;

    const application = await CampApplication.findOne({ _id: id, isDeleted: { $ne: true } });

    if (!application) {
      return NextResponse.json({ success: false, message: 'Přihláška nebyla nalezena' }, { status: 404 });
    }

    application.isDeleted = true;
    application.deletedAt = new Date();
    await application.save();

    logAction({
      action: 'Přihláška smazána',
      entity: 'camp-application',
      entityId: id,
      entityTitle: application.participantName,
      user: user?.username || 'admin',
    }).catch(() => {});

    return NextResponse.json({ success: true, message: 'Přihláška byla archivována' });
  } catch (error) {
    return dbError(error, 'DELETE /api/admin/camp-applications/[id] error:');
  }
}
