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

    // Načteme posledních 10 záznamů z auditního logu, což je mnohem efektivnější
    // než dotazování všech kolekcí samostatně.
    const activities = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const formattedActivities = activities.map(a => ({
      action: a.action,
      item: a.entityTitle,
      date: a.createdAt.toISOString(),
      user: a.user,
    }));

    return NextResponse.json({ success: true, data: formattedActivities });
  } catch (error) {
    return dbError(error, 'GET /api/admin/activity error:');
  }
}
