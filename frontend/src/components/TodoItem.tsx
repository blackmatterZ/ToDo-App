import React from 'react';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
}) => {
  return (
    <IonItem className="todo-item" data-testid={`todo-item-${todo.id}`}>
      <IonCheckbox
        slot="start"
        checked={todo.completed}
        onIonChange={(e) => onToggle(todo.id, e.detail.checked)}
        aria-label={todo.title}
        data-testid={`todo-checkbox-${todo.id}`}
      />
      <IonLabel
        style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          opacity: todo.completed ? 0.6 : 1,
        }}
      >
        <h2>{todo.title}</h2>
        <p>{new Date(todo.createdAt).toLocaleString()}</p>
      </IonLabel>
      <IonButton
        fill="clear"
        color="danger"
        slot="end"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
        data-testid={`todo-delete-${todo.id}`}
      >
        <IonIcon icon={trashOutline} slot="icon-only" />
      </IonButton>
    </IonItem>
  );
};

export default TodoItem;
