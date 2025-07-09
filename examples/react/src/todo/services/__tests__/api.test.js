import { todoAPI } from '../api';

global.fetch = jest.fn();

describe('todoAPI', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('fetchTodos', () => {
    test('fetches todos successfully', async () => {
      const mockTodos = [
        { id: 1, title: 'Test todo', completed: false, userId: 1 }
      ];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos
      });

      const result = await todoAPI.fetchTodos();

      expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos');
      expect(result).toEqual(mockTodos);
    });

    test('throws error when fetch fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(todoAPI.fetchTodos()).rejects.toThrow('Failed to fetch todos');
    });

    test('throws error when network fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(todoAPI.fetchTodos()).rejects.toThrow('Network error');
    });
  });

  describe('createTodo', () => {
    test('creates todo successfully', async () => {
      const newTodo = { title: 'New todo', completed: false, userId: 1 };
      const createdTodo = { id: 201, ...newTodo };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdTodo
      });

      const result = await todoAPI.createTodo(newTodo);

      expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo)
      });
      expect(result).toEqual(createdTodo);
    });

    test('throws error when creation fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      await expect(todoAPI.createTodo({})).rejects.toThrow('Failed to create todo');
    });
  });

  describe('updateTodo', () => {
    test('updates todo successfully', async () => {
      const updates = { completed: true };
      const updatedTodo = { id: 1, title: 'Test todo', completed: true, userId: 1 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedTodo
      });

      const result = await todoAPI.updateTodo(1, updates);

      expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      expect(result).toEqual(updatedTodo);
    });

    test('throws error when update fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(todoAPI.updateTodo(1, {})).rejects.toThrow('Failed to update todo');
    });
  });

  describe('deleteTodo', () => {
    test('deletes todo successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true
      });

      await todoAPI.deleteTodo(1);

      expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/1', {
        method: 'DELETE'
      });
    });

    test('throws error when deletion fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(todoAPI.deleteTodo(1)).rejects.toThrow('Failed to delete todo');
    });
  });
});
