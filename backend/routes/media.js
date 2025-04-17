
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, authorize } = require('../middleware/auth');
const mediaQueries = require('../db/queries/media');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

// Get all media files
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, type } = req.query;
    const filters = {};
    
    if (search) filters.search = search;
    if (type) filters.type = type;
    
    // Limit non-admin users to only see their own uploads
    if (req.user.role !== 'admin') {
      filters.userId = req.user.id;
    }
    
    const media = await mediaQueries.getAllMedia(filters);
    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload a new media file
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const mediaData = {
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      userId: req.user.id
    };
    
    const result = await mediaQueries.createMedia(mediaData);
    
    res.status(201).json({ 
      id: result.insertId,
      filePath: mediaData.filePath,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a media file
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Get the media file info
    const [mediaFile] = await mediaQueries.getMediaById(req.params.id);
    
    if (!mediaFile || mediaFile.length === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    // Check if user is authorized to delete
    if (req.user.role !== 'admin' && mediaFile[0].uploaded_by !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this file' });
    }
    
    // Delete the file from filesystem
    const filePath = path.join(__dirname, '..', mediaFile[0].file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete the database entry
    await mediaQueries.deleteMedia(req.params.id);
    
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
