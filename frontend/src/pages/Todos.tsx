import React, { useState, useEffect, useCallback } from 'react';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonSpinner,
  IonBadge,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonInput,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import Layout from '../components/Layout';
import api from '../services/api';
import { Todo, Category } from '../types/todo';

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newCategoryId, setNewCategoryId] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [todosRes, catsRes] = await Promise.all([
        api.getTodos(1, 100, search, selectedCategory),
        api.getCategories(1, 100)
      ]);
      setTodos(todosRes.data);
      setCategories(catsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    try {
      await api.createTodo({
        title: newTitle,
        categoryId: newCategoryId || undefined,
      });
      setNewTitle('');
      setNewCategoryId('');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      await api.updateTodo(todo.id, { completed: !todo.completed });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTodo(id);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout onSearch={setSearch}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <IonItem style={{ flex: 1, '--border-radius': '8px', '--background': 'var(--surface)' }}>
          <IonInput 
            placeholder="New todo..." 
            value={newTitle} 
            onIonInput={e => setNewTitle(e.detail.value!)} 
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </IonItem>
        <IonItem style={{ '--border-radius': '8px', '--background': 'var(--surface)' }}>
          <IonSelect 
            value={newCategoryId} 
            onIonChange={e => setNewCategoryId(e.detail.value)} 
            placeholder="Category"
          >
            <IonSelectOption value="">None</IonSelectOption>
            {categories.map(c => (
              <IonSelectOption key={c.id} value={c.id}>{c.name}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonButton onClick={handleAdd}>Add Todo</IonButton>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <IonItem style={{ '--border-radius': '8px', '--background': 'var(--surface)', maxWidth: '300px' }}>
          <IonLabel>Filter:</IonLabel>
          <IonSelect 
            value={selectedCategory} 
            onIonChange={e => setSelectedCategory(e.detail.value)}
          >
            <IonSelectOption value="">All</IonSelectOption>
            {categories.map(c => (
              <IonSelectOption key={c.id} value={c.id}>{c.name}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <IonSpinner />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {todos.map(todo => {
            const cat = categories.find(c => c.id === todo.categoryId);
            return (
              <IonCard key={todo.id} style={{ margin: 0, '--background': 'var(--surface)' }}>
                <IonCardContent style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '10px' }}>
                  <IonCheckbox 
                    checked={todo.completed} 
                    onIonChange={() => handleToggle(todo)} 
                  />
                  <div style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none' }}>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text)' }}>{todo.title}</div>
                  </div>
                  
                  {cat && (
                    <IonBadge style={{ backgroundColor: cat.color }}>{cat.name}</IonBadge>
                  )}

                  <IonBadge color={todo.completed ? 'success' : 'medium'}>
                    {todo.completed ? 'Completed' : 'Pending'}
                  </IonBadge>

                  <IonButton fill="clear" color="danger" onClick={() => handleDelete(todo.id)}>
                    <IonIcon icon={trashOutline} slot="icon-only" />
                  </IonButton>
                </IonCardContent>
              </IonCard>
            );
          })}
          {todos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text)' }}>
              No todos found.
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Todos;
