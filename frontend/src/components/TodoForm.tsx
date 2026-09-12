import React, { useState } from 'react';
import {
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';

interface TodoFormProps {
  onAdd: (title: string) => Promise<void>;
  disabled?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd, disabled = false }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || isSubmitting || disabled) return;

    try {
      setIsSubmitting(true);
      await onAdd(trimmed);
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ion-margin-bottom" data-testid="todo-form">
      <IonItem lines="full">
        <IonInput
          value={title}
          placeholder="What needs to be done?"
          onIonInput={(e) => setTitle(e.detail.value || '')}
          disabled={disabled || isSubmitting}
          required
          aria-label="Todo title"
          data-testid="todo-input"
        />
        <IonButton
          type="submit"
          slot="end"
          disabled={!title.trim() || disabled || isSubmitting}
          data-testid="add-todo-button"
        >
          <IonIcon icon={addOutline} slot="start" />
          Add
        </IonButton>
      </IonItem>
    </form>
  );
};

export default TodoForm;
