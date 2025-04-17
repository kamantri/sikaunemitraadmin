
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const noteQueries = require('../db/queries/notes');

// Get all notes
router.get('/', async (req, res) => {
  try {
    const { category, grade, subject, search } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    if (grade) filters.grade = grade;
    if (subject) filters.subject = subject;
    if (search) filters.search = search;
    
    const notes = await noteQueries.getAllNotes(filters);
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get note by id
router.get('/:id', async (req, res) => {
  try {
    const [note] = await noteQueries.getNoteById(req.params.id);
    
    if (note.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(note[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create note
router.post('/', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { title, content, category, grade, subject, price, fileUrl, fileType } = req.body;
    
    const noteData = {
      title,
      content,
      category,
      grade,
      subject,
      price: price || 0,
      fileUrl,
      fileType,
      userId: req.user.id
    };
    
    const result = await noteQueries.createNote(noteData);
    res.status(201).json({ id: result.insertId, message: 'Note created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:id', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { title, content, category, grade, subject, price, fileUrl, fileType } = req.body;
    
    const noteData = {
      title,
      content,
      category,
      grade,
      subject,
      price,
      fileUrl,
      fileType
    };
    
    await noteQueries.updateNote(req.params.id, noteData);
    res.json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle pin status
router.put('/:id/pin', authenticate, authorize('admin'), async (req, res) => {
  try {
    await noteQueries.togglePinStatus(req.params.id);
    res.json({ message: 'Pin status toggled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle availability
router.put('/:id/availability', authenticate, authorize('admin'), async (req, res) => {
  try {
    await noteQueries.toggleAvailability(req.params.id);
    res.json({ message: 'Availability toggled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await noteQueries.deleteNote(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
