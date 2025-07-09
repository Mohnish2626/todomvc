import { appReducer } from '../reducer';
import * as types from '../constants';

describe('appReducer', () => {
  const initialState = {
    todos: [],
    theme: 'light',
    loading: false,
    creating: false,
    updating: null,
    deleting: null,
    error: null
  };

  test('returns initial state for unknown action', () => {
    expect(() => appReducer(initialState, { type: 'UNKNOWN' })).toThrow('Unknown action: UNKNOWN');
  });

  describe('fetch todos actions', () => {
    test('handles FETCH_TODOS_START', () => {
      const action = { type: types.FETCH_TODOS_START };
      const newState = appReducer(initialState, action);

      expect(newState).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    test('handles FETCH_TODOS_SUCCESS', () => {
      const todos = [{ id: 1, title: 'Test todo', completed: false }];
      const action = { type: types.FETCH_TODOS_SUCCESS, payload: todos };
      const newState = appReducer({ ...initialState, loading: true }, action);

      expect(newState).toEqual({
        ...initialState,
        todos,
        loading: false,
        error: null
      });
    });

    test('handles FETCH_TODOS_ERROR', () => {
      const error = 'Network error';
      const action = { type: types.FETCH_TODOS_ERROR, payload: error };
      const newState = appReducer({ ...initialState, loading: true }, action);

      expect(newState).toEqual({
        ...initialState,
        loading: false,
        error
      });
    });
  });

  describe('create todo actions', () => {
    test('handles CREATE_TODO_START with optimistic update', () => {
      const optimisticTodo = { id: 'temp-123', title: 'New todo', completed: false };
      const action = { type: types.CREATE_TODO_START, payload: optimisticTodo };
      const newState = appReducer(initialState, action);

      expect(newState).toEqual({
        ...initialState,
        todos: [optimisticTodo],
        creating: true,
        error: null
      });
    });

    test('handles CREATE_TODO_SUCCESS', () => {
      const tempId = 'temp-123';
      const optimisticTodo = { id: tempId, title: 'New todo', completed: false };
      const createdTodo = { id: 201, title: 'New todo', completed: false };
      const action = { type: types.CREATE_TODO_SUCCESS, payload: { ...createdTodo, tempId } };
      const state = { ...initialState, todos: [optimisticTodo], creating: true };
      const newState = appReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        todos: [{ ...createdTodo, id: 201 }],
        creating: false
      });
    });

    test('handles CREATE_TODO_ERROR', () => {
      const tempId = 'temp-123';
      const optimisticTodo = { id: tempId, title: 'New todo', completed: false };
      const error = 'Creation failed';
      const action = { type: types.CREATE_TODO_ERROR, payload: { error, tempId } };
      const state = { ...initialState, todos: [optimisticTodo], creating: true };
      const newState = appReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        todos: [],
        creating: false,
        error
      });
    });
  });

  describe('update todo actions', () => {
    test('handles UPDATE_TODO_START', () => {
      const action = { type: types.UPDATE_TODO_START, payload: { id: 1, updates: { completed: true } } };
      const newState = appReducer(initialState, action);

      expect(newState).toEqual({
        ...initialState,
        updating: 1
      });
    });

    test('handles UPDATE_TODO_SUCCESS', () => {
      const existingTodo = { id: 1, title: 'Test todo', completed: false };
      const updatedTodo = { id: 1, title: 'Test todo', completed: true };
      const action = { type: types.UPDATE_TODO_SUCCESS, payload: updatedTodo };
      const state = { ...initialState, todos: [existingTodo], updating: 1 };
      const newState = appReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        todos: [updatedTodo],
        updating: null
      });
    });

    test('handles UPDATE_TODO_ERROR', () => {
      const existingTodo = { id: 1, title: 'Test todo', completed: false };
      const updates = { completed: true };
      const error = 'Update failed';
      const action = { type: types.UPDATE_TODO_ERROR, payload: { error, id: 1, updates } };
      const state = { ...initialState, todos: [existingTodo], updating: 1 };
      const newState = appReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        todos: [{ ...existingTodo, ...updates }],
        updating: null,
        error
      });
    });
  });

  describe('delete todo actions', () => {
    test('handles DELETE_TODO_START', () => {
      const action = { type: types.DELETE_TODO_START, payload: { id: 1 } };
      const newState = appReducer(initialState, action);

      expect(newState).toEqual({
        ...initialState,
        deleting: 1
      });
    });

    test('handles DELETE_TODO_SUCCESS', () => {
      const existingTodo = { id: 1, title: 'Test todo', completed: false };
      const action = { type: types.DELETE_TODO_SUCCESS, payload: { id: 1 } };
      const state = { ...initialState, todos: [existingTodo], deleting: 1 };
      const newState = appReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        todos: [],
        deleting: null
      });
    });

    test('handles DELETE_TODO_ERROR', () => {
      const existingTodo = { id: 1, title: 'Test todo', completed: false };
      const error = 'Delete failed';
      const action = { type: types.DELETE_TODO_ERROR, payload: { error, id: 1 } };
      const state = { ...initialState, todos: [existingTodo], deleting: 1 };
      const newState = appReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        todos: [existingTodo],
        deleting: null,
        error
      });
    });
  });

  describe('error handling', () => {
    test('handles CLEAR_ERROR', () => {
      const action = { type: types.CLEAR_ERROR };
      const state = { ...initialState, error: 'Some error' };
      const newState = appReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        error: null
      });
    });
  });

  describe('theme actions', () => {
    test('handles TOGGLE_THEME from light to dark', () => {
      const action = { type: types.TOGGLE_THEME };
      const newState = appReducer(initialState, action);

      expect(newState).toEqual({
        ...initialState,
        theme: 'dark'
      });
    });

    test('handles TOGGLE_THEME from dark to light', () => {
      const action = { type: types.TOGGLE_THEME };
      const state = { ...initialState, theme: 'dark' };
      const newState = appReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        theme: 'light'
      });
    });
  });

  describe('legacy actions', () => {
    test('handles ADD_ITEM', () => {
      const action = { type: types.ADD_ITEM, payload: { title: 'New todo' } };
      const newState = appReducer(initialState, action);

      expect(newState.todos).toHaveLength(1);
      expect(newState.todos[0]).toMatchObject({
        title: 'New todo',
        completed: false,
        id: expect.any(String)
      });
    });

    test('handles TOGGLE_ITEM', () => {
      const existingTodo = { id: 1, title: 'Test todo', completed: false };
      const action = { type: types.TOGGLE_ITEM, payload: { id: 1 } };
      const state = { ...initialState, todos: [existingTodo] };
      const newState = appReducer(state, action);

      expect(newState.todos[0].completed).toBe(true);
    });

    test('handles REMOVE_COMPLETED_ITEMS', () => {
      const todos = [
        { id: 1, title: 'Active todo', completed: false },
        { id: 2, title: 'Completed todo', completed: true }
      ];
      const action = { type: types.REMOVE_COMPLETED_ITEMS };
      const state = { ...initialState, todos };
      const newState = appReducer(state, action);

      expect(newState.todos).toEqual([
        { id: 1, title: 'Active todo', completed: false }
      ]);
    });

    test('handles TOGGLE_ALL', () => {
      const todos = [
        { id: 1, title: 'Todo 1', completed: false },
        { id: 2, title: 'Todo 2', completed: false }
      ];
      const action = { type: types.TOGGLE_ALL, payload: { completed: true } };
      const state = { ...initialState, todos };
      const newState = appReducer(state, action);

      expect(newState.todos.every(todo => todo.completed)).toBe(true);
    });
  });
});
