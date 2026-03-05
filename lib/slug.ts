import type { Model } from 'mongoose';

export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function uniqueSlug(model: Model<any>, title: string): Promise<string> {
  const base = toSlug(title);
  const existing = await model.findOne({ slug: base });
  return existing ? `${base}-${Date.now()}` : base;
}
