import React, { useState, useEffect, useCallback } from 'react';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonItem,
  IonInput,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import Layout from '../components/Layout';
import api from '../services/api';
import { Category } from '../types/todo';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b6ef6');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getCategories(1, 100);
      setCategories(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await api.createCategory({
        name: newName,
        color: newColor,
      });
      setNewName('');
      setNewColor('#3b6ef6');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCategory(id);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <IonItem style={{ flex: 1, '--border-radius': '8px', '--background': 'var(--surface)' }}>
          <IonInput 
            placeholder="New Category Name" 
            value={newName} 
            onIonInput={e => setNewName(e.detail.value!)} 
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </IonItem>
        <IonItem style={{ '--border-radius': '8px', '--background': 'var(--surface)', width: '100px' }}>
          <input 
            type="color" 
            value={newColor} 
            onChange={e => setNewColor(e.target.value)} 
            style={{ width: '100%', border: 'none', background: 'none' }}
          />
        </IonItem>
        <IonButton onClick={handleAdd}>Add</IonButton>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <IonSpinner />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {categories.map(cat => (
            <IonCard key={cat.id} style={{ margin: 0, '--background': 'var(--surface)' }}>
              <IonCardContent style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '10px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: cat.color }} />
                <div style={{ flex: 1, fontSize: '1.1rem', color: 'var(--text)' }}>{cat.name}</div>
                <IonButton fill="clear" color="danger" onClick={() => handleDelete(cat.id)}>
                  <IonIcon icon={trashOutline} slot="icon-only" />
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
          {categories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text)' }}>
              No categories found.
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Categories;
