import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import RentalRequest from '@/models/RentalRequest';
import { requireAuth } from '@/lib/auth-middleware';
import { parsePagination, paginationMeta } from '@/lib/pagination';
import { validateDateRange, isValidEmail, isValidPhone, parseStatusFilter } from '@/lib/validation';
import { checkRateLimit, FORM_MAX } from '@/lib/rate-limit';
import { dbError, isValidationError, validationError } from '@/lib/api-response';
import { sendRentalNotification } from '@/lib/mailer';
// GET - Načíst žádosti o pronájem (pouze pro adminy)
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    const validStatus = parseStatusFilter(status);
    if (validStatus) filter.status = validStatus;

    const requests = await RentalRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await RentalRequest.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        requests,
        pagination: paginationMeta(page, limit, total),
      }
    });
  } catch (error) {
    return dbError(error, 'GET /api/admin/rental-requests error:');
  }
}

// POST - Vytvořit novou žádost o pronájem (veřejné API)
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const rateCheck = checkRateLimit(`rental-request:${ip}`, FORM_MAX);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, message: `Příliš mnoho požadavků. Zkuste to znovu za ${rateCheck.retryAfter} sekund.` },
      { status: 429 }
    );
  }

  try {
    await connectToMongoose();

    const body = await request.json();

    const requiredFields = ['name', 'email', 'phone', 'startDate', 'endDate', 'guestCount', 'purpose'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} je povinný` },
          { status: 400 }
        );
      }
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Neplatný formát emailové adresy' },
        { status: 400 }
      );
    }

    if (!isValidPhone(body.phone)) {
      return NextResponse.json(
        { success: false, message: 'Neplatný formát telefonního čísla' },
        { status: 400 }
      );
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputStartDate = new Date(startDate);
    inputStartDate.setHours(0, 0, 0, 0);

    if (inputStartDate < today) {
      return NextResponse.json(
        { success: false, message: 'Datum příjezdu nemůže být v minulosti' },
        { status: 400 }
      );
    }

    const dateError = validateDateRange(startDate, endDate);
    if (dateError) {
      return NextResponse.json({ success: false, message: dateError }, { status: 400 });
    }

    const conflictingRequests = await RentalRequest.find({
      status: 'approved',
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }]
    });

    if (conflictingRequests.length > 0) {
      return NextResponse.json(
        { success: false, message: 'V tomto termínu je hájenka již zarezervována' },
        { status: 409 }
      );
    }

    const rentalRequest = new RentalRequest({
      name: body.name,
      email: body.email,
      phone: body.phone,
      organization: body.organization,
      startDate,
      endDate,
      guestCount: parseInt(body.guestCount),
      purpose: body.purpose,
      facilities: body.facilities || [],
      message: body.message,
      status: 'pending'
    });

    await rentalRequest.save();

    sendRentalNotification({
      name: body.name,
      email: body.email,
      phone: body.phone,
      organization: body.organization,
      startDate,
      endDate,
      guestCount: parseInt(body.guestCount),
      purpose: body.purpose,
      facilities: body.facilities || [],
      message: body.message,
    }).catch((err) => console.error('sendRentalNotification selhalo:', err));

    return NextResponse.json({
      success: true,
      message: 'Žádost o pronájem byla úspěšně odeslána',
      data: rentalRequest
    }, { status: 201 });

  } catch (error: unknown) {
    if (isValidationError(error)) return validationError(error);
    return dbError(error, 'POST /api/admin/rental-requests error:');
  }
}
