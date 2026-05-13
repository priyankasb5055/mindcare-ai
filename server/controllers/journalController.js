import Journal from '../models/Journal.js';

export const createJournal = async (req, res) => {
  try {
    const { title, content, mood, isPrivate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const journal = await Journal.create({
      userId: req.user._id,
      title,
      content,
      mood,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
    });

    res.status(201).json({
      success: true,
      message: 'Journal created successfully',
      data: journal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJournals = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { title: { $regex: req.query.search, $options: 'i' } },
            { content: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const journals = await Journal.find({ userId: req.user._id, ...keyword }).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Journals fetched successfully',
      data: journals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJournalById = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }

    if (journal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      message: 'Journal fetched successfully',
      data: journal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJournal = async (req, res) => {
  try {
    const { title, content, mood, isPrivate } = req.body;

    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }

    if (journal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    journal.title = title || journal.title;
    journal.content = content || journal.content;
    journal.mood = mood || journal.mood;
    if (isPrivate !== undefined) {
      journal.isPrivate = isPrivate;
    }

    const updatedJournal = await journal.save();

    res.json({
      success: true,
      message: 'Journal updated successfully',
      data: updatedJournal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }

    if (journal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await journal.deleteOne();

    res.json({ success: true, message: 'Journal removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
