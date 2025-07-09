const API_BASE = 'https://jsonplaceholder.typicode.com';

/**
 * API service for TodoMVC with JSONPlaceholder integration
 * Provides CRUD operations for todo items
 */
export const todoAPI = {
  /**
   * Fetches all todos from the API
   * @returns {Promise<Array>} Array of todo objects
   * @throws {Error} When the fetch operation fails
   */
  async fetchTodos() {
    const response = await fetch(`${API_BASE}/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    const todos = await response.json();
    return todos.slice(0, 20);
  },

  /**
   * Creates a new todo
   * @param {Object} todo - Todo object to create
   * @param {string} todo.title - Title of the todo
   * @param {boolean} todo.completed - Completion status
   * @param {number} todo.userId - User ID
   * @returns {Promise<Object>} Created todo object with ID
   * @throws {Error} When the creation fails
   */
  async createTodo(todo) {
    const response = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },

  /**
   * Updates an existing todo
   * @param {number} id - ID of the todo to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated todo object
   * @throws {Error} When the update fails
   */
  async updateTodo(id, updates) {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update todo');
    return response.json();
  },

  /**
   * Deletes a todo
   * @param {number} id - ID of the todo to delete
   * @returns {Promise<void>}
   * @throws {Error} When the deletion fails
   */
  async deleteTodo(id) {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete todo');
    return { id };
  }
};
