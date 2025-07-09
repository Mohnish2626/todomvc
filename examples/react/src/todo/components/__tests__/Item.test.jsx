import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Item } from '../item';

describe('Item', () => {
  const mockDispatch = jest.fn();
  const defaultTodo = {
    id: 1,
    title: 'Test todo',
    completed: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo item', () => {
    render(<Item todo={defaultTodo} dispatch={mockDispatch} />);
    
    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-button')).toBeInTheDocument();
  });

  test('shows completed state', () => {
    const completedTodo = { ...defaultTodo, completed: true };
    render(<Item todo={completedTodo} dispatch={mockDispatch} />);
    
    const checkbox = screen.getByTestId('todo-item-toggle');
    expect(checkbox).toBeChecked();
  });

  test('shows uncompleted state', () => {
    render(<Item todo={defaultTodo} dispatch={mockDispatch} />);
    
    const checkbox = screen.getByTestId('todo-item-toggle');
    expect(checkbox).not.toBeChecked();
  });

  test('toggles todo when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<Item todo={defaultTodo} dispatch={mockDispatch} />);
    
    const checkbox = screen.getByTestId('todo-item-toggle');
    await user.click(checkbox);
    
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('deletes todo when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<Item todo={defaultTodo} dispatch={mockDispatch} />);
    
    const deleteButton = screen.getByTestId('todo-item-button');
    await user.click(deleteButton);
    
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('enters edit mode when label is double clicked', async () => {
    const user = userEvent.setup();
    render(<Item todo={defaultTodo} dispatch={mockDispatch} />);
    
    const label = screen.getByTestId('todo-item-label');
    await user.dblClick(label);
    
    expect(screen.getByDisplayValue('Test todo')).toBeInTheDocument();
  });

  test('updates todo when edit is submitted', async () => {
    const user = userEvent.setup();
    render(<Item todo={defaultTodo} dispatch={mockDispatch} />);
    
    const label = screen.getByTestId('todo-item-label');
    await user.dblClick(label);
    
    const input = screen.getByDisplayValue('Test todo');
    await user.clear(input);
    await user.type(input, 'Updated todo');
    await user.keyboard('{Enter}');
    
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('shows updating state', () => {
    render(<Item todo={defaultTodo} dispatch={mockDispatch} isUpdating={true} />);
    
    expect(screen.getByText('⟳')).toBeInTheDocument();
  });

  test('shows deleting state', () => {
    render(<Item todo={defaultTodo} dispatch={mockDispatch} isDeleting={true} />);
    
    expect(screen.getByText('⟳')).toBeInTheDocument();
  });

  test('disables controls when updating', () => {
    render(<Item todo={defaultTodo} dispatch={mockDispatch} isUpdating={true} />);
    
    const checkbox = screen.getByTestId('todo-item-toggle');
    const deleteButton = screen.getByTestId('todo-item-button');
    
    expect(checkbox).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  test('disables controls when deleting', () => {
    render(<Item todo={defaultTodo} dispatch={mockDispatch} isDeleting={true} />);
    
    const checkbox = screen.getByTestId('todo-item-toggle');
    const deleteButton = screen.getByTestId('todo-item-button');
    
    expect(checkbox).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});
