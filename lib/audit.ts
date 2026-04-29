import connectToMongoose from '@/lib/mongoose';
import AuditLog from '@/models/AuditLog';

interface AuditParams {
  action: string;
  entity: string;
  entityId?: string;
  entityTitle: string;
  user: string;
  details?: string;
}

export async function logAction(params: AuditParams): Promise<void> {
  try {
    await connectToMongoose();
    await AuditLog.create(params);
  } catch (err) {
    console.error('AuditLog zápis selhal:', err);
  }
}
