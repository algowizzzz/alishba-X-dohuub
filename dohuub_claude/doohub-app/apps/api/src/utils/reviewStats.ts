import { prisma } from '@doohub/database';

/** Real rating / reviewCount from Review rows (overrides seeded Vendor fields). */
export async function getReviewStatsByVendorIds(vendorIds: string[]) {
  const unique = [...new Set(vendorIds.filter(Boolean))];
  const out = new Map<string, { rating: number; reviewCount: number }>();
  if (unique.length === 0) return out;

  const rows = await prisma.review.groupBy({
    by: ['vendorId'],
    where: { vendorId: { in: unique } },
    _avg: { rating: true },
    _count: { _all: true },
  });

  for (const row of rows) {
    const count = row._count._all;
    const avg = row._avg.rating ?? 0;
    out.set(row.vendorId, {
      rating: count > 0 ? Math.round(avg * 10) / 10 : 0,
      reviewCount: count,
    });
  }

  return out;
}

export function applyReviewStatsToVendor<T extends { id: string; rating?: number | null; reviewCount?: number | null }>(
  vendor: T,
  stats: Map<string, { rating: number; reviewCount: number }>
): T {
  const s = stats.get(vendor.id);
  return {
    ...vendor,
    rating: s?.rating ?? 0,
    reviewCount: s?.reviewCount ?? 0,
  };
}
