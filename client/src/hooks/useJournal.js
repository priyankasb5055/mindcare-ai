import { useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useJournal = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJournals = useCallback(async (searchQuery = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/journals${searchQuery ? `?search=${searchQuery}` : ''}`);
      if (res.data.success) {
        setJournals(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch journals');
    } finally {
      setLoading(false);
    }
  }, []);

  const createJournal = async (journalData) => {
    try {
      const res = await api.post('/journals', journalData);
      if (res.data.success) {
        toast.success('Journal saved!');
        setJournals(prev => [res.data.data, ...prev]);
        return res.data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save journal');
      return null;
    }
  };

  const updateJournal = async (id, journalData) => {
    try {
      const res = await api.put(`/journals/${id}`, journalData);
      if (res.data.success) {
        toast.success('Journal updated!');
        setJournals(prev => prev.map(j => j._id === id ? res.data.data : j));
        return res.data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update journal');
      return null;
    }
  };

  const deleteJournal = async (id) => {
    try {
      const res = await api.delete(`/journals/${id}`);
      if (res.data.success) {
        toast.success('Journal deleted');
        setJournals(prev => prev.filter(j => j._id !== id));
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete journal');
      return false;
    }
  };

  return {
    journals,
    loading,
    fetchJournals,
    createJournal,
    updateJournal,
    deleteJournal
  };
};
