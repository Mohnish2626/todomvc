import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../header';

describe('Header', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header with title and input', () => {
    render(<Header dispatch={mockDispatch} theme="light" creating={false} />);
    
    expect(screen.getByText('todos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  test('shows correct theme toggle text for light theme', () => {
    render(<Header dispatch={mockDispatch} theme="light" creating={false} />);
    
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  test('shows correct theme toggle text for dark theme', () => {
    render(<Header dispatch={mockDispatch} theme="dark" creating={false} />);
    
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });

  test('adds creating indicator class when creating', () => {
    const { container } = render(<Header dispatch={mockDispatch} theme="light" creating={true} />);
    
    expect(container.querySelector('.creating-indicator')).toBeInTheDocument();
  });

  test('does not add creating indicator class when not creating', () => {
    const { container } = render(<Header dispatch={mockDispatch} theme="light" creating={false} />);
    
    expect(container.querySelector('.creating-indicator')).toBeNull();
  });

  test('calls addItem when todo is submitted', async () => {
    const user = userEvent.setup();
    render(<Header dispatch={mockDispatch} theme="light" creating={false} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'New todo');
    await user.keyboard('{Enter}');
    
    expect(mockDispatch).toHaveBeenCalled();
  });
});
