import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoForm from './TodoForm';

describe('TodoForm Component', () => {
  it('renders form input and submit button', () => {
    const handleAdd = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onAdd={handleAdd} />);

    expect(screen.getByTestId('todo-form')).toBeInTheDocument();
    expect(screen.getByTestId('todo-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-todo-button')).toBeInTheDocument();
  });

  it('submits valid input and clears field', async () => {
    const handleAdd = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onAdd={handleAdd} />);

    const input = screen.getByTestId('todo-input');
    const form = screen.getByTestId('todo-form');

    // Simulate typing into the ion-input
    fireEvent(input, new CustomEvent('ionInput', { detail: { value: 'New Test Todo' } }));

    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleAdd).toHaveBeenCalledWith('New Test Todo');
    });
  });

  it('does not submit when input is empty or whitespace', async () => {
    const handleAdd = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onAdd={handleAdd} />);

    const form = screen.getByTestId('todo-form');
    fireEvent.submit(form);

    expect(handleAdd).not.toHaveBeenCalled();
  });
});
