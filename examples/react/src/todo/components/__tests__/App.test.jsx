import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../app';
import * as api from '../../services/api';

jest.mock('../../services/api');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.todoAPI.fetchTodos.mockResolvedValue([
      { id: 1, title: 'Test todo', completed: false, userId: 1 }
    ]);
  });

  test('renders app with initial state', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByText('todos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });
  });

  test('initializes with light theme', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    expect(document.body.className).toBe('light-theme');
  });

  test('toggles theme when theme toggle is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    const themeToggle = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(themeToggle);
    
    expect(document.body.className).toBe('dark-theme');
  });

  test('fetches todos on mount', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(api.todoAPI.fetchTodos).toHaveBeenCalledTimes(1);
    });
  });

  test('displays loading state initially', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
  });

  test('handles fetch error', async () => {
    api.todoAPI.fetchTodos.mockRejectedValue(new Error('Network error'));
    
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
