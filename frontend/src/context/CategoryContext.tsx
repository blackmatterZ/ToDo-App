import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Category } from '../types/todo';

let _tmpId = 0;
const tmpId = () => `tmp-cat-${++_tmpId}`;

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  addCategory: (name: string, color: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getCategories(1, 200);
      setCategories(res.data);
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addCategory = async (name: string, color: string) => {
    const optimisticEntry: Category = { id: tmpId(), name, color };
    setCategories(prev => [optimisticEntry, ...prev]);

    try {
      const created = await api.createCategory({ name, color });
      setCategories(prev => prev.map(c => c.id === optimisticEntry.id ? created : c));
    } catch (e) {
      setCategories(prev => prev.filter(c => c.id !== optimisticEntry.id));
      throw e;
    }
  };

  const removeCategory = async (id: string) => {
    if (id.startsWith('tmp-')) return;
    
    const removed = categories.find(c => c.id === id);
    setCategories(prev => prev.filter(c => c.id !== id));

    try {
      await api.deleteCategory(id);
    } catch (e) {
      if (removed) setCategories(prev => [...prev, removed]);
      throw e;
    }
  };

  return (
    <CategoryContext.Provider value={{
      categories,
      loading,
      addCategory,
      removeCategory,
      reload: loadData
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

