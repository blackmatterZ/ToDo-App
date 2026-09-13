import React, { useState } from 'react';
import { IonSpinner } from '@ionic/react';
import Layout from '../components/Layout';
import { useCategory } from '../context/CategoryContext';

const Categories: React.FC = () => {
  const { categories, addCategory, removeCategory, loading } = useCategory();
  
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b6ef6');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  /* ── OPTIMISTIC ADD ────────────────────────────── */
  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) { setError('Name is required'); return; }

    setError('');
    setAdding(true);

    try {
      await addCategory(name, newColor);
      setNewName('');
    } catch (e: any) {
      setError(e?.message || 'Failed to create category');
    } finally {
      setAdding(false);
    }
  };

  /* ── OPTIMISTIC DELETE ─────────────────────────── */
  const handleDelete = async (id: string) => {
    try {
      await removeCategory(id);
    } catch (e: any) {
      setError(e?.message || 'Failed to delete category');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <Layout title="Categories">
      {/* ── Add row ──────────────────────────────────── */}
      <div className="input-row" style={{ alignItems: 'center' }}>
        {/* Color picker */}
        <label
          className="color-swatch-picker"
          title="Pick a color"
          style={{ backgroundColor: newColor }}
        >
          <input
            type="color"
            value={newColor}
            onChange={e => setNewColor(e.target.value)}
            style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          />
        </label>

        {/* Name input */}
        <input
          type="text"
          placeholder="Category name…"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--text)',
            fontSize: '0.95rem',
            padding: '6px 4px',
          }}
        />

        <button
          className="btn-primary"
          onClick={handleAdd}
          disabled={adding || !newName.trim()}
        >
          {adding ? 'Adding…' : '+ Add Category'}
        </button>
      </div>

      {/* ── Error message ─────────────────────────────── */}
      {error && (
        <div style={{
          background: 'color-mix(in srgb, #e64747 10%, transparent)',
          border: '1px solid color-mix(in srgb, #e64747 30%, transparent)',
          color: '#e64747',
          borderRadius: 8,
          padding: '8px 14px',
          fontSize: '0.88rem',
          marginBottom: 16,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── List ─────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <IonSpinner name="dots" />
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>🏷️</span>
          <p style={{ margin: 0, fontWeight: 500 }}>No categories yet</p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Create one above to organise your todos.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {categories.map((cat, idx) => {
            const isPending = cat.id.startsWith('tmp-');
            return (
              <div
                key={cat.id}
                className="app-card animate-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  opacity: isPending ? 0.6 : 1,
                  animationDelay: `${idx * 0.03}s`,
                }}
              >
                {/* Color accent bar on the left */}
                <div style={{
                  width: 4,
                  height: 40,
                  borderRadius: 4,
                  background: cat.color,
                  flexShrink: 0,
                }} />

                {/* Color dot */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `color-mix(in srgb, ${cat.color} 20%, transparent)`,
                  border: `2px solid color-mix(in srgb, ${cat.color} 50%, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: cat.color }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
                    {cat.name}
                  </div>
                  {isPending && (
                    <div style={{ fontSize: '0.75rem', color: 'color-mix(in srgb, var(--text) 40%, transparent)' }}>
                      Saving…
                    </div>
                  )}
                </div>

                <button
                  className="btn-danger-ghost"
                  onClick={() => handleDelete(cat.id)}
                  disabled={isPending}
                  title="Delete category"
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

export default Categories;
