import React, { useState, useEffect, useCallback } from 'react';
import { IonSpinner } from '@ionic/react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Todo } from '../types/todo';
import { useCategory } from '../context/CategoryContext';

let _tmpId = 0;
const tmpId = () => `tmp-todo-${++_tmpId}`;


const formatDate = (isoStr: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(isoStr));
};

const Todos: React.FC = () => {
  const { categories } = useCategory();
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newCategoryId, setNewCategoryId] = useState<string>('');
  const [newDueAt, setNewDueAt] = useState('');
  
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getTodos(1, 100, search, selectedCategory);
      setTodos(res.data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── OPTIMISTIC ADD ────────────────────────────── */
  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title) return;
    
    setError('');
    setAdding(true);
    
    const optimisticTodo: Todo = {
      id: tmpId(),
      title,
      status: 'Pending',
      categoryId: newCategoryId || null,
      dueAt: newDueAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTodos(prev => [optimisticTodo, ...prev]);
    setNewTitle('');
    setNewCategoryId('');
    setNewDueAt('');

    try {
      const created = await api.createTodo({
        title,
        categoryId: optimisticTodo.categoryId || undefined,
        dueAt: optimisticTodo.dueAt || undefined,
      });
      setTodos(prev => prev.map(t => t.id === optimisticTodo.id ? created : t));
    } catch (e: any) {
      setTodos(prev => prev.filter(t => t.id !== optimisticTodo.id));
      setError(e?.message || 'Failed to create todo');
    } finally {
      setAdding(false);
    }
  };

  /* ── OPTIMISTIC TOGGLE ─────────────────────────── */
  const handleToggle = async (todo: Todo) => {
    if (todo.id.startsWith('tmp-')) return;
    
    const newStatus = todo.status === 'Pending' ? 'Completed' : 'Pending';
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, status: newStatus } : t));
    
    try {
      const updated = await api.updateTodo(todo.id, { status: newStatus });
      setTodos(prev => prev.map(t => t.id === todo.id ? updated : t));
    } catch (e: any) {
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, status: todo.status } : t));
      setError(e?.message || 'Failed to update todo');
    }
  };

  /* ── OPTIMISTIC DELETE ─────────────────────────── */
  const handleDelete = async (id: string) => {
    if (id.startsWith('tmp-')) return;
    
    const removed = todos.find(t => t.id === id);
    setTodos(prev => prev.filter(t => t.id !== id));
    
    try {
      await api.deleteTodo(id);
    } catch (e: any) {
      if (removed) setTodos(prev => [...prev, removed]);
      setError(e?.message || 'Failed to delete todo');
    }
  };

  return (
    <Layout onSearch={setSearch} title="Todos">
      {/* ── Add & Filter ──────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div className="input-row" style={{ flex: 1, margin: 0, minWidth: '300px' }}>
          <input 
            type="text"
            placeholder="What needs to be done?" 
            value={newTitle} 
            onChange={e => setNewTitle(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '10px', pointerEvents: 'none', fontSize: '1.1rem' }}>📅</span>
            <input 
              type="date"
              value={newDueAt}
              onChange={e => setNewDueAt(e.target.value)}
              style={{
                padding: '10px 12px 10px 38px',
                borderRadius: '8px',
                border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)',
                background: 'color-mix(in srgb, var(--surface) 50%, var(--background))',
                color: 'var(--text)',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '150px'
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'color-mix(in srgb, var(--text) 20%, transparent)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <select 
            className="app-select"
            value={newCategoryId}
            onChange={e => setNewCategoryId(e.target.value)}
            style={{ border: 'none', background: 'transparent' }}
          >
            <option value="">No Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={handleAdd} disabled={adding || !newTitle.trim()}>
            {adding ? 'Adding...' : 'Add'}
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'color-mix(in srgb, var(--text) 60%, transparent)', fontWeight: 500 }}>Filter:</span>
          <select 
            className="app-select"
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Error message ─────────────────────────────── */}
      {error && (
        <div style={{
          background: 'color-mix(in srgb, var(--accent-warning) 15%, transparent)',
          border: '1px solid color-mix(in srgb, var(--accent-warning) 30%, transparent)',
          color: 'var(--text)',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: '0.9rem',
          marginBottom: 16,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── List ─────────────────────────────────────── */}
      {loading && todos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <IonSpinner name="dots" />
        </div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>📝</span>
          <p style={{ margin: 0, fontWeight: 500 }}>No todos found</p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {todos.map((todo, idx) => {
            const cat = categories.find(c => c.id === todo.categoryId);
            const isPending = todo.id.startsWith('tmp-');
            const isCompleted = todo.status === 'Completed';
            const isOverdue = todo.status === 'Pending' && todo.dueAt && new Date() > new Date(todo.dueAt);
            
            return (
              <div 
                key={todo.id} 
                className="app-card animate-in"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '12px 16px',
                  opacity: isPending ? 0.6 : 1,
                  animationDelay: `${idx * 0.02}s`,
                }}
              >
                <input 
                  type="checkbox"
                  className="app-checkbox"
                  checked={isCompleted}
                  onChange={() => handleToggle(todo)}
                  disabled={isPending}
                />
                
                <div style={{ 
                  flex: 1, 
                  textDecoration: isCompleted ? 'line-through' : 'none',
                  color: isCompleted ? 'color-mix(in srgb, var(--text) 50%, transparent)' : 'var(--text)',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <span>{todo.title}</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: 'color-mix(in srgb, var(--text) 50%, transparent)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      📝 Created: {formatDate(todo.createdAt)}
                    </span>
                    {todo.dueAt && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: isOverdue ? 'var(--accent-warning)' : 'color-mix(in srgb, var(--text) 50%, transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        📅 Due: {formatDate(todo.dueAt)} {isOverdue && <span style={{fontWeight: 600}}>(Overdue)</span>}
                      </span>
                    )}
                  </div>
                </div>
                
                {cat && (
                  <span className="pill" style={{ 
                    background: `color-mix(in srgb, ${cat.color} 15%, transparent)`,
                    color: cat.color,
                    border: `1px solid color-mix(in srgb, ${cat.color} 25%, transparent)`
                  }}>
                    {cat.name}
                  </span>
                )}

                <span className={`pill ${isCompleted ? 'pill-success' : 'pill-pending'}`}>
                  {todo.status}
                </span>

                <button 
                  className="btn-danger-ghost" 
                  onClick={() => handleDelete(todo.id)}
                  disabled={isPending}
                  title="Delete todo"
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Todos;
