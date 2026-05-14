import { useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useMood = () => {
  const [moods, setMoods] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMoods = useCallback(async (limit = 0) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/moods${limit ? `?limit=${limit}` : ''}`);
      if (res.data.success) {
        setMoods(res.data.data.moods);
        return res.data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch moods');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMoodStats = useCallback(async () => {
    try {
      const res = await api.get('/api/moods/stats');
      if (res.data.success) {
        setStats(res.data.data);
        return res.data.data;
      }
    } catch (error) {
      console.error('Failed to fetch mood stats', error);
    }
  }, []);

  const createMood = async (moodData) => {
    try {
      const res = await api.post('/api/moods', moodData);
      if (res.data.success) {
        toast.success('Mood logged successfully!');
        // Optimistic update
        setMoods(prev => [res.data.data, ...prev]);
        return res.data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log mood');
      return null;
    }
  };

  const deleteMood = async (id) => {
    try {
      const res = await api.delete(`/api/moods/${id}`);
      if (res.data.success) {
        toast.success('Mood deleted');
        setMoods(prev => prev.filter(m => m._id !== id));
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete mood');
      return false;
    }
  };

  return {
    moods,
    stats,
    loading,
    fetchMoods,
    fetchMoodStats,
    createMood,
    deleteMood
  };
};
