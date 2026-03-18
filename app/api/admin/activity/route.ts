import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import Article from '@/models/Article';
import CampApplication from '@/models/CampApplication';
import RentalRequest from '@/models/RentalRequest';
import Rental from '@/models/Rental';
import Event from '@/models/Event';
import Content from '@/models/Content';
import PhotoGallery from '@/models/PhotoGallery';
import { requireAuth, getUserFromToken } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

interface ActivityItem {
  action: string;
  item: string;
  date: string;
  user: string;
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const tokenUser = await getUserFromToken(request);
  const fallbackUser = tokenUser?.username ?? 'Admin';

  try {
    await connectToMongoose();

    const LIMIT = 5;
    const select = 'createdAt updatedAt';

    const [articles, campApplications, rentalRequests, rentals, events, contents, galleries] = await Promise.all([
      Article.find().sort({ updatedAt: -1 }).limit(LIMIT).select(`title status processedBy ${select}`).lean(),
      CampApplication.find().sort({ updatedAt: -1 }).limit(LIMIT).select(`participantName status processedBy ${select}`).lean(),
      RentalRequest.find().sort({ updatedAt: -1 }).limit(LIMIT).select(`name status processedBy ${select}`).lean(),
      Rental.find().sort({ updatedAt: -1 }).limit(LIMIT).select(`name status createdBy ${select}`).lean(),
      Event.find().sort({ updatedAt: -1 }).limit(LIMIT).select(`title modifiedBy ${select}`).lean(),
      Content.find().sort({ updatedAt: -1 }).limit(LIMIT).select(`page modifiedBy ${select}`).lean(),
      PhotoGallery.find().sort({ updatedAt: -1 }).limit(LIMIT).select(`title createdBy ${select}`).lean(),
    ]);

    const items: ActivityItem[] = [];

    const isNew = (doc: any) =>
      Math.abs(new Date(doc.updatedAt).getTime() - new Date(doc.createdAt).getTime()) < 5000;

    for (const a of articles) {
      items.push({
        action: isNew(a) ? 'Nový článek' : `Úprava článku (${a.status === 'published' ? 'publikován' : 'koncept'})`,
        item: (a as any).title,
        date: a.updatedAt.toISOString(),
        user: (a as any).processedBy || fallbackUser,
      });
    }

    for (const c of campApplications) {
      const ca = c as any;
      let action = isNew(c) ? 'Nová přihláška na tábor' : 'Přihláška aktualizována';
      if (!isNew(c) && ca.status === 'approved') action = 'Přihláška schválena';
      if (!isNew(c) && ca.status === 'rejected') action = 'Přihláška zamítnuta';
      items.push({ action, item: ca.participantName, date: c.updatedAt.toISOString(), user: ca.processedBy || fallbackUser });
    }

    for (const r of rentalRequests) {
      const rr = r as any;
      let action = isNew(r) ? 'Nová žádost o pronájem' : 'Žádost aktualizována';
      if (!isNew(r) && rr.status === 'approved') action = 'Žádost o pronájem schválena';
      if (!isNew(r) && rr.status === 'rejected') action = 'Žádost o pronájem zamítnuta';
      items.push({ action, item: rr.name, date: r.updatedAt.toISOString(), user: rr.processedBy || fallbackUser });
    }

    for (const r of rentals) {
      const rn = r as any;
      items.push({
        action: isNew(r) ? 'Nový pronájem' : 'Pronájem aktualizován',
        item: rn.name,
        date: r.updatedAt.toISOString(),
        user: rn.createdBy || fallbackUser,
      });
    }

    for (const e of events) {
      const ev = e as any;
      items.push({
        action: isNew(e) ? 'Nová akce v kalendáři' : 'Akce aktualizována',
        item: ev.title,
        date: e.updatedAt.toISOString(),
        user: ev.modifiedBy || fallbackUser,
      });
    }

    for (const c of contents) {
      const co = c as any;
      const pageLabels: Record<string, string> = {
        home: 'Úvodní stránka',
        pioneerGroups: 'Pionýrské oddíly',
        siteData: 'Kontaktní údaje',
        rental: 'Pronájem Hájenky',
      };
      items.push({
        action: 'Obsah upraven',
        item: pageLabels[co.page] || co.page,
        date: c.updatedAt.toISOString(),
        user: co.modifiedBy || fallbackUser,
      });
    }

    for (const g of galleries) {
      const ga = g as any;
      items.push({
        action: isNew(g) ? 'Nová fotogalerie' : 'Galerie aktualizována',
        item: ga.title,
        date: g.updatedAt.toISOString(),
        user: ga.createdBy || fallbackUser,
      });
    }

    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ success: true, data: items.slice(0, 10) });
  } catch (error) {
    return dbError(error, 'GET /api/admin/activity error:');
  }
}
