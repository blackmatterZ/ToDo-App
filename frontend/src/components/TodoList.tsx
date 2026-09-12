import React from 'react';
import { IonList, IonText } from '@ionic/react';
import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
}) => {
  if (todos.length === 0) {
    return (
      <div
        className="ion-text-center ion-padding"
        data-testid="empty-todo-message"
        style={{ marginTop: '2rem', color: 'var(--ion-color-medium)' }}
      >
        <IonText>
          <p>No todos yet! Add your first task below.</p>
        </IonText>
      </div>
    );
  }

  return (
    <IonList data-testid="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </IonList>
  );
};

export default TodoList;
