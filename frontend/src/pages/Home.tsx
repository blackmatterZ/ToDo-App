import React, { useEffect, useState, useCallback } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonToast,
  IonRefresher,
  IonRefresherContent,
  IonButton,
  IonText,
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import { Todo } from '../types/todo';
import api from '../services/api';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await api.getTodos();
      setTodos(data);
    } catch (err: any) {
      const msg = err?.message || 'Failed to load todos from server';
      setErrorMessage(msg);
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    try {
      const data = await api.getTodos();
      setTodos(data);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to refresh todos');
      setShowToast(true);
    } finally {
      event.detail.complete();
    }
  };

  const handleAdd = async (title: string) => {
    try {
      const created = await api.createTodo({ title });
      setTodos((prev) => [created, ...prev]);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to add todo');
      setShowToast(true);
      throw err;
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      const updated = await api.updateTodo(id, { completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update todo');
      setShowToast(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to delete todo');
      setShowToast(true);
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <TodoForm onAdd={handleAdd} disabled={isLoading} />

        {isLoading ? (
          <div
            className="ion-text-center ion-padding"
            data-testid="loading-spinner"
            style={{ marginTop: '3rem' }}
          >
            <IonSpinner name="crescent" color="primary" />
            <IonText color="medium">
              <p>Loading todos...</p>
            </IonText>
          </div>
        ) : errorMessage && todos.length === 0 ? (
          <div
            className="ion-text-center ion-padding"
            data-testid="error-container"
            style={{ marginTop: '2rem' }}
          >
            <IonText color="danger">
              <p>{errorMessage}</p>
            </IonText>
            <IonButton fill="outline" onClick={fetchTodos}>
              Retry
            </IonButton>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}

        <IonToast
          isOpen={showToast}
          message={errorMessage || ''}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
          color="danger"
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
