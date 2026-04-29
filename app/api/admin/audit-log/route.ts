import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import AuditLog from '@/models/AuditLog';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const entity = searchParams.get('entity');

    const filter: Record<string, unknown> = {};
    if (entity) filter.entity = entity;

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return dbError(error, 'GET /api/admin/audit-log error:');
  }
}
