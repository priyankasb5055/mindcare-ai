import React from 'react';
import Calendar from 'react-calendar';

const MoodCalendar = ({ moods }) => {

  const getMoodEmoji = (date) => {
    const moodEntry = moods.find((m) => {
      const moodDate = new Date(m.date);

      return (
        moodDate.getDate() === date.getDate() &&
        moodDate.getMonth() === date.getMonth() &&
        moodDate.getFullYear() === date.getFullYear()
      );
    });

    if (!moodEntry) return null;

    const moodMap = {
      great: '😄',
      good: '🙂',
      okay: '😐',
      bad: '😞',
      terrible: '😢',
    };

    return moodMap[moodEntry.mood];
  };

  return (
    <div className="glass-card p-6">

      <h3 className="text-lg font-semibold text-textPrimary mb-4">
        Mood Calendar
      </h3>

      <Calendar
        tileContent={({ date, view }) =>
          view === 'month' ? (
            <div className="text-center text-lg mt-1">
              {getMoodEmoji(date)}
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default MoodCalendar;