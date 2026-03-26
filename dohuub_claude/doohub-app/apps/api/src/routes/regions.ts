import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all regions
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { country, countryCode, city, isActive, page = '1', limit = '100' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (country) {
      where.country = country;
    }

    if (countryCode) {
      where.countryCode = countryCode;
    }

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const regions = await prisma.region.findMany({
      where,
      orderBy: [
        { country: 'asc' },
        { name: 'asc' },
      ],
      skip,
      take: limitNum,
    });

    const total = await prisma.region.count({ where });

    // Get countries list
    const countries = await prisma.region.findMany({
      where: { isActive: true },
      select: { country: true, countryCode: true },
      distinct: ['country'],
    });

    res.json({
      success: true,
      data: regions,
      countries: countries.map(c => ({
        name: c.country,
        code: c.countryCode,
        flag: c.countryCode === 'US' ? '🇺🇸' : c.countryCode === 'CA' ? '🇨🇦' : '',
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get regions error:', error);
    res.status(500).json({ error: 'Failed to get regions' });
  }
});

// Get regions grouped by country
router.get('/grouped', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { isActive } = req.query;

    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const regions = await prisma.region.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    // Group by country
    const grouped: Record<string, {
      country: string;
      countryCode: string;
      flag: string;
      regions: typeof regions;
    }> = {};

    for (const region of regions) {
      if (!grouped[region.country]) {
        grouped[region.country] = {
          country: region.country,
          countryCode: region.countryCode,
          flag: region.countryCode === 'US' ? '🇺🇸' : region.countryCode === 'CA' ? '🇨🇦' : '',
          regions: [],
        };
      }
      grouped[region.country].regions.push(region);
    }

    res.json({
      success: true,
      data: Object.values(grouped),
    });
  } catch (error) {
    console.error('Get grouped regions error:', error);
    res.status(500).json({ error: 'Failed to get regions' });
  }
});

// Get region by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const region = await prisma.region.findUnique({
      where: { id },
    });

    if (!region) {
      return res.status(404).json({ error: 'Region not found' });
    }

    res.json({ success: true, data: region });
  } catch (error) {
    console.error('Get region error:', error);
    res.status(500).json({ error: 'Failed to get region' });
  }
});

// Search regions
router.get('/search/:query', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { query } = req.params;
    const { limit = '10' } = req.query;

    const limitNum = parseInt(limit as string);

    const regions = await prisma.region.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { state: { contains: query, mode: 'insensitive' } },
          { province: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limitNum,
      orderBy: { name: 'asc' },
    });

    // Format for frontend (match VendorStoreForm expected format)
    const formattedRegions = regions.map(region => ({
      id: region.id,
      name: region.name,
      countryCode: region.countryCode,
      countryName: region.country,
      countryFlag: region.countryCode === 'US' ? '🇺🇸' : region.countryCode === 'CA' ? '🇨🇦' : '',
      isActive: region.isActive,
    }));

    res.json({
      success: true,
      data: formattedRegions,
    });
  } catch (error) {
    console.error('Search regions error:', error);
    res.status(500).json({ error: 'Failed to search regions' });
  }
});

export default router;
