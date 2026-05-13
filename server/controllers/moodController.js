import Mood from '../models/Mood.js';

const getEmojiForMood = (mood) => {
  const map = {
    great: '😄',
    good: '🙂',
    okay: '😐',
    bad: '😞',
    terrible: '😢'
  };
  return map[mood] || '😐';
};

const getScoreForMood = (mood) => {
  const map = {
    great: 5,
    good: 4,
    okay: 3,
    bad: 2,
    terrible: 1
  };
  return map[mood] || 3;
};

export const createMood = async (req, res) => {
  try {
    const { mood, note, tags } = req.body;
    
    if (!mood) {
      return res.status(400).json({ success: false, message: 'Mood is required' });
    }

    const emoji = getEmojiForMood(mood);
    const moodScore = getScoreForMood(mood);

    const newMood = await Mood.create({
      userId: req.user._id,
      mood,
      moodScore,
      emoji,
      note,
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      message: 'Mood logged successfully',
      data: newMood
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMoods = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const moods = await Mood.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(limit);

    const totalEntries = await Mood.countDocuments({ userId: req.user._id });
    
    let averageScore = 0;
    if (moods.length > 0) {
      const sum = moods.reduce((acc, curr) => acc + curr.moodScore, 0);
      averageScore = (sum / moods.length).toFixed(1);
    }

    res.json({
      success: true,
      message: 'Moods fetched successfully',
      data: {
        moods,
        averageScore: Number(averageScore),
        totalEntries
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMoodStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentMoods = await Mood.find({ 
      userId,
      date: { $gte: last7Days }
    });

    let weeklyAverage = 0;
    if (recentMoods.length > 0) {
      const sum = recentMoods.reduce((acc, curr) => acc + curr.moodScore, 0);
      weeklyAverage = (sum / recentMoods.length).toFixed(1);
    }

    // Mood distribution
    const distribution = await Mood.aggregate([
      { $match: { userId } },
      { $group: { _id: '$mood', count: { $sum: 1 } } }
    ]);

    // Format distribution
    const moodDistribution = {
      great: 0, good: 0, okay: 0, bad: 0, terrible: 0
    };
    let mostFrequentMood = 'none';
    let maxCount = 0;

    distribution.forEach(d => {
      moodDistribution[d._id] = d.count;
      if (d.count > maxCount) {
        maxCount = d.count;
        mostFrequentMood = d._id;
      }
    });

    // Calculate streak
    const allMoods = await Mood.find({ userId }).sort({ date: -1 });
    let streakCount = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < allMoods.length; i++) {
      const moodDate = new Date(allMoods[i].date);
      moodDate.setHours(0, 0, 0, 0);
      
      const diffTime = Math.abs(currentDate - moodDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 0 || diffDays === 1) {
        if (i === 0 || diffDays === 1) {
            streakCount++;
            currentDate = moodDate;
        }
      } else if (diffDays > 1 && i === 0) {
         // Missed today, maybe they logged yesterday
         const yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);
         yesterday.setHours(0,0,0,0);
         if(moodDate.getTime() === yesterday.getTime()) {
             streakCount++;
             currentDate = moodDate;
         } else {
             break;
         }
      } else {
          break;
      }
    }

    res.json({
      success: true,
      message: 'Mood stats fetched successfully',
      data: {
        weeklyAverage: Number(weeklyAverage),
        mostFrequentMood,
        streakCount,
        moodDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ success: false, message: 'Mood not found' });
    }

    if (mood.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    await mood.deleteOne();
    
    res.json({ success: true, message: 'Mood removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
