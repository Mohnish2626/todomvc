import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../theme-toggle';

describe('ThemeToggle', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders theme toggle button', () => {
    render(<ThemeToggle dispatch={mockDispatch} theme="light" />);
    
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  test('shows correct icon for light theme', () => {
    render(<ThemeToggle dispatch={mockDispatch} theme="light" />);
    
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  test('shows correct icon for dark theme', () => {
    render(<ThemeToggle dispatch={mockDispatch} theme="dark" />);
    
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  test('shows correct aria-label for light theme', () => {
    render(<ThemeToggle dispatch={mockDispatch} theme="light" />);
    
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  test('shows correct aria-label for dark theme', () => {
    render(<ThemeToggle dispatch={mockDispatch} theme="dark" />);
    
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });

  test('shows correct title for light theme', () => {
    render(<ThemeToggle dispatch={mockDispatch} theme="light" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
  });

  test('shows correct title for dark theme', () => {
    render(<ThemeToggle dispatch={mockDispatch} theme="dark" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to light mode');
  });

  test('calls dispatch with TOGGLE_THEME when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle dispatch={mockDispatch} theme="light" />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_THEME' });
  });

  test('has correct CSS classes', () => {
    render(<ThemeToggle dispatch={mockDispatch} theme="light" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('theme-toggle');
    
    const track = button.querySelector('.theme-toggle-track');
    expect(track).toBeInTheDocument();
    
    const thumb = button.querySelector('.theme-toggle-thumb');
    expect(thumb).toBeInTheDocument();
    
    const icon = button.querySelector('.theme-icon');
    expect(icon).toBeInTheDocument();
  });
});
