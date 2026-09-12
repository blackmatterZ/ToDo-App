import React, { useEffect, useState, useCallback } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Todo } from '../types/todo';
import api from '../services/api';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = useCallback(async () => {
    try {
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      console.error('Failed to fetch todos', err);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (title: string) => {
    try {
      const created = await api.createTodo({ title });
      setTodos((prev) => [created, ...prev]);
    } catch (err) {
      console.error('Failed to create todo', err);
      throw err;
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      const updated = await api.updateTodo(id, { completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Failed to update todo', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete todo', err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Todo Application</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <TodoForm onAdd={handleAdd} />
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
