import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input', () => {
  const mockOnSubmit = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input with placeholder', () => {
    render(<Input onSubmit={mockOnSubmit} placeholder="Test placeholder" label="Test label" />);
    
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
    expect(screen.getByLabelText('Test label')).toBeInTheDocument();
  });

  test('renders input with default value', () => {
    render(<Input onSubmit={mockOnSubmit} defaultValue="Default text" label="Test label" />);
    
    expect(screen.getByDisplayValue('Default text')).toBeInTheDocument();
  });

  test('calls onSubmit when Enter is pressed with text', async () => {
    const user = userEvent.setup();
    render(<Input onSubmit={mockOnSubmit} placeholder="Test placeholder" label="Test label" />);
    
    const input = screen.getByPlaceholderText('Test placeholder');
    await user.type(input, 'New todo');
    await user.keyboard('{Enter}');
    
    expect(mockOnSubmit).toHaveBeenCalledWith('New todo');
  });

  test('does not call onSubmit when Enter is pressed with empty text', async () => {
    const user = userEvent.setup();
    render(<Input onSubmit={mockOnSubmit} placeholder="Test placeholder" label="Test label" />);
    
    const input = screen.getByPlaceholderText('Test placeholder');
    await user.keyboard('{Enter}');
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('does not call onSubmit when Enter is pressed with only whitespace', async () => {
    const user = userEvent.setup();
    render(<Input onSubmit={mockOnSubmit} placeholder="Test placeholder" label="Test label" />);
    
    const input = screen.getByPlaceholderText('Test placeholder');
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('clears input after successful submission', async () => {
    const user = userEvent.setup();
    render(<Input onSubmit={mockOnSubmit} placeholder="Test placeholder" label="Test label" />);
    
    const input = screen.getByPlaceholderText('Test placeholder');
    await user.type(input, 'New todo');
    await user.keyboard('{Enter}');
    
    expect(input.value).toBe('');
  });

  test('calls onBlur when provided and input loses focus', async () => {
    const user = userEvent.setup();
    render(<Input onSubmit={mockOnSubmit} onBlur={mockOnBlur} placeholder="Test placeholder" label="Test label" />);
    
    const input = screen.getByPlaceholderText('Test placeholder');
    await user.click(input);
    await user.tab();
    
    expect(mockOnBlur).toHaveBeenCalled();
  });

  test('does not call onBlur when not provided', async () => {
    const user = userEvent.setup();
    render(<Input onSubmit={mockOnSubmit} placeholder="Test placeholder" label="Test label" />);
    
    const input = screen.getByPlaceholderText('Test placeholder');
    await user.click(input);
    await user.tab();
    
    expect(mockOnBlur).not.toHaveBeenCalled();
  });

  test('trims whitespace from submitted text', async () => {
    const user = userEvent.setup();
    render(<Input onSubmit={mockOnSubmit} placeholder="Test placeholder" label="Test label" />);
    
    const input = screen.getByPlaceholderText('Test placeholder');
    await user.type(input, '  New todo  ');
    await user.keyboard('{Enter}');
    
    expect(mockOnSubmit).toHaveBeenCalledWith('New todo');
  });
});
