import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { supabase, STORAGE_BUCKETS, getPublicUrl } from '../utils/supabase';

const router = Router();

// Configure multer for memory storage (files stored in buffer for Supabase upload)
const storage = multer.memoryStorage();

// File filter for images
const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 10, // Maximum 10 files per request
  },
});

// Helper to determine bucket based on type
const getBucket = (type: string): string => {
  if (type === 'listing' || type === 'listings' || type === 'service') {
    return STORAGE_BUCKETS.LISTINGS;
  }
  return STORAGE_BUCKETS.UPLOADS;
};

// Helper to get file extension
const getExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : '';
};

// Upload single image to Supabase Storage
router.post('/image', authenticate, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Storage not configured. Please set Supabase credentials.' });
    }

    const type = (req.query.type as string) || 'general';
    const bucket = getBucket(type);
    const ext = getExtension(req.file.originalname);
    const filename = `${type}/${uuidv4()}${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Failed to upload to storage', details: error.message });
    }

    // Get public URL
    const publicUrl = getPublicUrl(bucket, filename);

    res.json({
      success: true,
      data: {
        id: data.path,
        filename: filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: publicUrl,
        bucket,
        type,
      },
    });
  } catch (error: any) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

// Upload multiple images to Supabase Storage
router.post('/images', authenticate, upload.array('images', 10), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Storage not configured. Please set Supabase credentials.' });
    }

    const type = (req.query.type as string) || 'general';
    const bucket = getBucket(type);

    const uploadPromises = files.map(async (file) => {
      const ext = getExtension(file.originalname);
      const filename = `${type}/${uuidv4()}${ext}`;

      const { data, error } = await supabase!.storage
        .from(bucket)
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new Error(`Failed to upload ${file.originalname}: ${error.message}`);
      }

      return {
        id: data.path,
        filename: filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: getPublicUrl(bucket, filename),
        bucket,
        type,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    res.json({
      success: true,
      data: uploadedFiles,
      count: uploadedFiles.length,
    });
  } catch (error: any) {
    console.error('Upload images error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload images' });
  }
});

// Delete file from Supabase Storage
router.delete('/:fileId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { fileId } = req.params;
    const { bucket = STORAGE_BUCKETS.UPLOADS } = req.query;

    if (!supabase) {
      return res.status(500).json({ error: 'Storage not configured' });
    }

    const { error } = await supabase.storage
      .from(bucket as string)
      .remove([fileId]);

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({ error: 'Failed to delete file', details: error.message });
    }

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get file info from Supabase Storage
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { bucket = STORAGE_BUCKETS.UPLOADS } = req.query;

    if (!supabase) {
      return res.status(500).json({ error: 'Storage not configured' });
    }

    // For Supabase, we just return the public URL
    const publicUrl = getPublicUrl(bucket as string, fileId);

    res.json({
      success: true,
      data: {
        id: fileId,
        url: publicUrl,
        bucket,
      },
    });
  } catch (error: any) {
    console.error('Get file info error:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

export default router;
