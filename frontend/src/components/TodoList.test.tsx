import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from './TodoList';
import { Todo } from '../types/todo';

describe('TodoList Component', () => {
  const mockTodos: Todo[] = [
    {
      id: 1,
      title: 'First Todo',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Second Todo',
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it('renders empty message when todos array is empty', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByTestId('empty-todo-message')).toBeInTheDocument();
    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  it('renders list of todos when array has items', () => {
    render(<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
    expect(screen.getByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox changes', () => {
    const handleToggle = vi.fn();
    render(<TodoList todos={mockTodos} onToggle={handleToggle} onDelete={vi.fn()} />);

    const checkbox = screen.getByTestId('todo-checkbox-1');
    fireEvent(checkbox, new CustomEvent('ionChange', { detail: { checked: true } }));

    expect(handleToggle).toHaveBeenCalledWith(1, true);
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={handleDelete} />);

    const deleteBtn = screen.getByTestId('todo-delete-1');
    fireEvent.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledWith(1);
  });
});
