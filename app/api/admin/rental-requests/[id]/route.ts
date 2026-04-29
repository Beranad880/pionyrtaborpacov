import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import RentalRequest from '@/models/RentalRequest';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { dbError, isValidationError, validationError } from '@/lib/api-response';
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
    const rentalRequest = await RentalRequest.findOne({ _id: id, isDeleted: { $ne: true } });

    if (!rentalRequest) {
      return NextResponse.json({ success: false, message: 'Žádost nebyla nalezena' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rentalRequest });
  } catch (error) {
    return dbError(error, 'GET /api/admin/rental-requests/[id] error:');
  }
}

async function updateRentalRequest(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const tokenUser = await getUserFromToken(request);

  try {
    await connectToMongoose();
    const { id } = await params;

    const body = await request.json();
    const rentalRequest = await RentalRequest.findOne({ _id: id, isDeleted: { $ne: true } });

    if (!rentalRequest) {
      return NextResponse.json({ success: false, message: 'Žádost nebyla nalezena' }, { status: 404 });
    }

    if (body.status && ['pending', 'approved', 'rejected'].includes(body.status)) {
      rentalRequest.status = body.status;

      if (body.status !== 'pending') {
        rentalRequest.processedAt = new Date();
        rentalRequest.processedBy = tokenUser?.username ?? 'admin';
      }

      if (body.status === 'approved') {
        const conflictingRequests = await RentalRequest.find({
          _id: { $ne: id },
          isDeleted: { $ne: true },
          status: 'approved',
          $or: [{ startDate: { $lte: rentalRequest.endDate }, endDate: { $gte: rentalRequest.startDate } }]
        });

        if (conflictingRequests.length > 0) {
          return NextResponse.json(
            { success: false, message: 'V tomto termínu je hájenka již zarezervována' },
            { status: 409 }
          );
        }
      }

      const actionLabel = body.status === 'approved' ? 'schválena' : body.status === 'rejected' ? 'zamítnuta' : 'aktualizována';
      logAction({
        action: `Žádost o pronájem ${actionLabel}`,
        entity: 'rental-request',
        entityId: id,
        entityTitle: rentalRequest.name,
        user: tokenUser?.username || 'admin',
      }).catch(() => {});
    }

    if (body.adminNotes !== undefined) rentalRequest.adminNotes = body.adminNotes;

    await rentalRequest.save();

    return NextResponse.json({ success: true, message: 'Žádost byla úspěšně aktualizována', data: rentalRequest });
  } catch (error: unknown) {
    if (isValidationError(error)) return validationError(error);
    return dbError(error, 'PUT /api/admin/rental-requests/[id] error:');
  }
}

export const PUT = updateRentalRequest;
export const PATCH = updateRentalRequest;

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

    const rentalRequest = await RentalRequest.findOne({ _id: id, isDeleted: { $ne: true } });

    if (!rentalRequest) {
      return NextResponse.json({ success: false, message: 'Žádost nebyla nalezena' }, { status: 404 });
    }

    rentalRequest.isDeleted = true;
    rentalRequest.deletedAt = new Date();
    await rentalRequest.save();

    logAction({
      action: 'Žádost o pronájem smazána',
      entity: 'rental-request',
      entityId: id,
      entityTitle: rentalRequest.name,
      user: user?.username || 'admin',
    }).catch(() => {});

    return NextResponse.json({ success: true, message: 'Žádost byla archivována' });
  } catch (error) {
    return dbError(error, 'DELETE /api/admin/rental-requests/[id] error:');
  }
}
