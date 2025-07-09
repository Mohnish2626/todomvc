import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Main } from '../main';

describe('Main', () => {
  const mockDispatch = jest.fn();

  const renderMain = (state, initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Main state={state} dispatch={mockDispatch} />
      </MemoryRouter>
    );
  };
  const defaultState = {
    todos: [],
    loading: false,
    error: null,
    updating: null,
    deleting: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state', () => {
    const state = { ...defaultState, loading: true };
    renderMain(state);
    
    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
  });

  test('displays error message', () => {
    const state = { ...defaultState, error: 'Network error' };
    renderMain(state);
    
    expect(screen.getByText('Error: Network error')).toBeInTheDocument();
  });

  test('renders empty todo list', () => {
    renderMain(defaultState);
    
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
    expect(screen.queryByTestId('toggle-all')).not.toBeInTheDocument();
  });

  test('renders todos and toggle all when todos exist', () => {
    const state = {
      ...defaultState,
      todos: [
        { id: 1, title: 'Test todo 1', completed: false },
        { id: 2, title: 'Test todo 2', completed: true }
      ]
    };
    renderMain(state);
    
    expect(screen.getByText('Test todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test todo 2')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-all')).toBeInTheDocument();
  });

  test('toggle all checkbox reflects completion state', () => {
    const state = {
      ...defaultState,
      todos: [
        { id: 1, title: 'Test todo 1', completed: true },
        { id: 2, title: 'Test todo 2', completed: true }
      ]
    };
    renderMain(state);
    
    const toggleAll = screen.getByTestId('toggle-all');
    expect(toggleAll).toBeChecked();
  });

  test('filters todos based on route', () => {
    const state = {
      ...defaultState,
      todos: [
        { id: 1, title: 'Active todo', completed: false },
        { id: 2, title: 'Completed todo', completed: true }
      ]
    };
    renderMain(state, '/active');
    
    expect(screen.getByText('Active todo')).toBeInTheDocument();
    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
  });

  test('dismisses error when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const state = { ...defaultState, error: 'Network error' };
    renderMain(state);
    
    const dismissButton = screen.getByText('×');
    await user.click(dismissButton);
    
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('calls toggle all when toggle all checkbox is clicked', async () => {
    const user = userEvent.setup();
    const state = {
      ...defaultState,
      todos: [{ id: 1, title: 'Test todo', completed: false }]
    };
    renderMain(state);
    
    const toggleAll = screen.getByTestId('toggle-all');
    await user.click(toggleAll);
    
    expect(mockDispatch).toHaveBeenCalled();
  });
});
