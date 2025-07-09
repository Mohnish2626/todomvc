import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import { App } from '../todo/app';
import * as api from '../todo/services/api';

jest.mock('../todo/services/api');

describe('E2E User Flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.todoAPI.fetchTodos.mockResolvedValue([]);
    api.todoAPI.createTodo.mockImplementation(async (todo) => ({
      id: Date.now(),
      ...todo
    }));
    api.todoAPI.updateTodo.mockImplementation(async (id, updates) => ({
      id,
      title: 'Test todo',
      completed: false,
      userId: 1,
      ...updates
    }));
    api.todoAPI.deleteTodo.mockResolvedValue();
  });

  test('complete todo management workflow', async () => {
    const user = userEvent.setup();
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    await waitFor(() => {
      expect(api.todoAPI.fetchTodos).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Learn React Testing');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(api.todoAPI.createTodo).toHaveBeenCalledWith({
        title: 'Learn React Testing',
        completed: false,
        userId: 1
      });
    });

    expect(screen.getByText('Learn React Testing')).toBeInTheDocument();

    const checkbox = screen.getByTestId('todo-item-toggle');
    await user.click(checkbox);

    await waitFor(() => {
      expect(api.todoAPI.updateTodo).toHaveBeenCalled();
    });

    const deleteButton = screen.getByTestId('todo-item-button');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(api.todoAPI.deleteTodo).toHaveBeenCalled();
    });
  });

  test('dark mode toggle workflow', async () => {
    const user = userEvent.setup();
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    expect(document.body.className).toBe('light-theme');

    const themeToggle = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(themeToggle);

    expect(document.body.className).toBe('dark-theme');
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();

    await user.click(themeToggle);
    expect(document.body.className).toBe('light-theme');
  });

  test('error handling workflow', async () => {
    const user = userEvent.setup();
    api.todoAPI.fetchTodos.mockRejectedValue(new Error('Network error'));
    
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    const dismissButton = screen.getByText('×');
    await user.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
    });
  });

  test('filtering workflow', async () => {
    const user = userEvent.setup();
    api.todoAPI.fetchTodos.mockResolvedValue([
      { id: 1, title: 'Active todo', completed: false, userId: 1 },
      { id: 2, title: 'Completed todo', completed: true, userId: 1 }
    ]);

    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Active todo')).toBeInTheDocument();
      expect(screen.getByText('Completed todo')).toBeInTheDocument();
    });

    const activeFilter = screen.getByText('Active');
    await user.click(activeFilter);

    await waitFor(() => {
      expect(screen.getByText('Active todo')).toBeInTheDocument();
      expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
    });

    const completedFilter = screen.getByText('Completed');
    await user.click(completedFilter);

    await waitFor(() => {
      expect(screen.queryByText('Active todo')).not.toBeInTheDocument();
      expect(screen.getByText('Completed todo')).toBeInTheDocument();
    });
  });

  test('optimistic updates workflow', async () => {
    const user = userEvent.setup();
    let createResolve;
    const createPromise = new Promise(resolve => {
      createResolve = resolve;
    });
    api.todoAPI.createTodo.mockReturnValue(createPromise);

    render(
      <HashRouter initialEntries={['/']}>
        <App />
      </HashRouter>
    );

    await waitFor(() => {
      expect(api.todoAPI.fetchTodos).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Optimistic todo');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('1 item left!')).toBeInTheDocument();
    });

    const allFilter = screen.getByText('All');
    await user.click(allFilter);

    await waitFor(() => {
      expect(screen.getByText('Optimistic todo')).toBeInTheDocument();
    }, { timeout: 3000 });

    createResolve({ id: 201, title: 'Optimistic todo', completed: false, userId: 1 });

    await waitFor(() => {
      expect(screen.getByText('Optimistic todo')).toBeInTheDocument();
    });
  });
});
