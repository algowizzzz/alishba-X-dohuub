import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all companionship listings
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { vendorId, storeId, certification, specialty, supportType, language, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      status: 'ACTIVE',
      vendor: {
        isActive: true,
        subscriptionStatus: { in: ['TRIAL', 'ACTIVE'] },
      },
    };

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (storeId) {
      where.storeId = storeId;
    }

    if (certification) {
      where.certifications = { has: certification as string };
    }

    if (specialty) {
      where.specialties = { has: specialty as string };
    }

    if (supportType) {
      where.supportTypes = { has: supportType as string };
    }

    if (language) {
      where.languages = { has: language as string };
    }

    const listings = await prisma.companionshipListing.findMany({
      where,
      include: {
        vendor: {
          include: { categories: true, serviceAreas: true },
        },
        store: true,
      },
      orderBy: [
        { vendor: { isMichelle: 'desc' } },
        { vendor: { rating: 'desc' } },
      ],
      skip,
      take: limitNum,
    });

    const total = await prisma.companionshipListing.count({ where });

    // Get unique certifications
    const allCertifications = await prisma.companionshipListing.findMany({
      where: { status: 'ACTIVE' },
      select: { certifications: true },
    });
    const uniqueCertifications = [...new Set(allCertifications.flatMap(l => l.certifications))];

    // Get unique specialties
    const allSpecialties = await prisma.companionshipListing.findMany({
      where: { status: 'ACTIVE' },
      select: { specialties: true },
    });
    const uniqueSpecialties = [...new Set(allSpecialties.flatMap(l => l.specialties))];

    // Get unique support types
    const allSupportTypes = await prisma.companionshipListing.findMany({
      where: { status: 'ACTIVE' },
      select: { supportTypes: true },
    });
    const uniqueSupportTypes = [...new Set(allSupportTypes.flatMap(l => l.supportTypes))];

    // Get unique languages
    const allLanguages = await prisma.companionshipListing.findMany({
      where: { status: 'ACTIVE' },
      select: { languages: true },
    });
    const uniqueLanguages = [...new Set(allLanguages.flatMap(l => l.languages))];

    res.json({
      success: true,
      data: listings,
      filters: {
        certifications: uniqueCertifications,
        specialties: uniqueSpecialties,
        supportTypes: uniqueSupportTypes,
        languages: uniqueLanguages,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get companionship listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Create companionship listing (vendor only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const {
      storeId,
      title,
      description,
      hourlyRate,
      yearsOfExperience,
      image,
      credentialImages,
      certifications,
      specialties,
      supportTypes,
      languages,
      status,
    } = req.body;

    if (!title || hourlyRate === undefined) {
      return res.status(400).json({ error: 'title and hourlyRate are required' });
    }

    // Validate storeId belongs to vendor if provided
    if (storeId) {
      const store = await prisma.vendorStore.findFirst({
        where: { id: storeId, vendorId: vendor.id },
      });
      if (!store) {
        return res.status(400).json({ error: 'Invalid store ID' });
      }
    }

    const listing = await prisma.companionshipListing.create({
      data: {
        vendorId: vendor.id,
        storeId: storeId || null,
        title,
        description: description || 'No description provided',
        hourlyRate: parseFloat(hourlyRate),
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        image: image || null,
        credentialImages: credentialImages || [],
        certifications: certifications || [],
        specialties: specialties || [],
        supportTypes: supportTypes || [],
        languages: languages || [],
        status: status || 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create companionship listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get companionship vendors (MUST be before /:id)
router.get('/vendors/list', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { zipCode } = req.query;

    const where: any = {
      isActive: true,
      subscriptionStatus: { in: ['TRIAL', 'ACTIVE'] },
      categories: {
        some: { category: 'COMPANIONSHIP', isActive: true },
      },
    };

    if (zipCode) {
      where.serviceAreas = {
        some: { zipCodes: { has: zipCode as string }, isActive: true },
      };
    }

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        categories: true,
        serviceAreas: true,
        companionshipListings: {
          where: { status: 'ACTIVE' },
          take: 5,
        },
      },
      orderBy: [
        { isMichelle: 'desc' },
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
    });

    res.json({ success: true, data: vendors });
  } catch (error) {
    console.error('Get companionship vendors error:', error);
    res.status(500).json({ error: 'Failed to get vendors' });
  }
});

// Get companionship listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.companionshipListing.findUnique({
      where: { id },
      include: {
        vendor: {
          include: { categories: true, serviceAreas: true },
        },
        store: true,
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Get companionship listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

// Update companionship listing (vendor only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.companionshipListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const {
      storeId,
      title,
      description,
      hourlyRate,
      yearsOfExperience,
      image,
      credentialImages,
      certifications,
      specialties,
      supportTypes,
      languages,
      status,
    } = req.body;

    // Validate storeId if provided
    if (storeId) {
      const store = await prisma.vendorStore.findFirst({
        where: { id: storeId, vendorId: vendor.id },
      });
      if (!store) {
        return res.status(400).json({ error: 'Invalid store ID' });
      }
    }

    const listing = await prisma.companionshipListing.update({
      where: { id },
      data: {
        ...(storeId !== undefined && { storeId }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(hourlyRate !== undefined && { hourlyRate: parseFloat(hourlyRate) }),
        ...(yearsOfExperience !== undefined && { yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null }),
        ...(image !== undefined && { image }),
        ...(credentialImages !== undefined && { credentialImages }),
        ...(certifications !== undefined && { certifications }),
        ...(specialties !== undefined && { specialties }),
        ...(supportTypes !== undefined && { supportTypes }),
        ...(languages !== undefined && { languages }),
        ...(status && { status }),
      },
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update companionship listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete companionship listing (vendor only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.companionshipListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await prisma.companionshipListing.delete({ where: { id } });

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete companionship listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;
