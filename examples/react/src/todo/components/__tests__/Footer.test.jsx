import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '../footer';

describe('Footer', () => {
  const mockDispatch = jest.fn();

  const renderFooter = (todos = [], initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Footer todos={todos} dispatch={mockDispatch} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when no todos', () => {
    const { container } = renderFooter([]);
    
    expect(container.firstChild).toBeNull();
  });

  test('renders footer with todo count', () => {
    const todos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true }
    ];
    renderFooter(todos);
    
    expect(screen.getByText('1 item left!')).toBeInTheDocument();
  });

  test('shows plural form for multiple items', () => {
    const todos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: false }
    ];
    renderFooter(todos);
    
    expect(screen.getByText('2 items left!')).toBeInTheDocument();
  });

  test('renders filter links', () => {
    const todos = [{ id: 1, title: 'Todo 1', completed: false }];
    renderFooter(todos);
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('highlights active filter', () => {
    const todos = [{ id: 1, title: 'Todo 1', completed: false }];
    renderFooter(todos, '/active');
    
    const activeLink = screen.getByText('Active');
    expect(activeLink).toHaveClass('selected');
  });

  test('shows clear completed button when completed todos exist', () => {
    const todos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true }
    ];
    renderFooter(todos);
    
    expect(screen.getByText('Clear completed')).toBeInTheDocument();
  });

  test('disables clear completed button when no completed todos', () => {
    const todos = [{ id: 1, title: 'Todo 1', completed: false }];
    renderFooter(todos);
    
    const clearButton = screen.getByText('Clear completed');
    expect(clearButton).toBeDisabled();
  });

  test('calls clear completed when button is clicked', async () => {
    const user = userEvent.setup();
    const todos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true }
    ];
    renderFooter(todos);
    
    const clearButton = screen.getByText('Clear completed');
    await user.click(clearButton);
    
    expect(mockDispatch).toHaveBeenCalled();
  });
});
