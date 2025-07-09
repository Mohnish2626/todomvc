import * as actions from '../actions';
import * as types from '../constants';
import { todoAPI } from '../services/api';

jest.mock('../services/api');

describe('actions', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTodos', () => {
    test('dispatches success action when fetch succeeds', async () => {
      const mockTodos = [{ id: 1, title: 'Test todo', completed: false }];
      todoAPI.fetchTodos.mockResolvedValue(mockTodos);

      await actions.fetchTodos(mockDispatch)();

      expect(mockDispatch).toHaveBeenCalledWith({ type: types.FETCH_TODOS_START });
      expect(mockDispatch).toHaveBeenCalledWith({ 
        type: types.FETCH_TODOS_SUCCESS, 
        payload: mockTodos 
      });
    });

    test('dispatches error action when fetch fails', async () => {
      const errorMessage = 'Network error';
      todoAPI.fetchTodos.mockRejectedValue(new Error(errorMessage));

      await actions.fetchTodos(mockDispatch)();

      expect(mockDispatch).toHaveBeenCalledWith({ type: types.FETCH_TODOS_START });
      expect(mockDispatch).toHaveBeenCalledWith({ 
        type: types.FETCH_TODOS_ERROR, 
        payload: errorMessage 
      });
    });
  });

  describe('createTodo', () => {
    test('dispatches success action when creation succeeds', async () => {
      const title = 'New todo';
      const createdTodo = { id: 201, title, completed: false, userId: 1 };
      todoAPI.createTodo.mockResolvedValue(createdTodo);

      await actions.createTodo(mockDispatch)(title);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.CREATE_TODO_START,
        payload: expect.objectContaining({
          title,
          completed: false,
          userId: 1,
          id: expect.stringMatching(/^temp-\d+$/)
        })
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.CREATE_TODO_SUCCESS,
        payload: expect.objectContaining({
          ...createdTodo,
          tempId: expect.stringMatching(/^temp-\d+$/)
        })
      });
    });

    test('dispatches error action when creation fails', async () => {
      const title = 'New todo';
      const errorMessage = 'Creation failed';
      todoAPI.createTodo.mockRejectedValue(new Error(errorMessage));

      await actions.createTodo(mockDispatch)(title);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.CREATE_TODO_START,
        payload: expect.any(Object)
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.CREATE_TODO_ERROR,
        payload: {
          error: errorMessage,
          tempId: expect.stringMatching(/^temp-\d+$/)
        }
      });
    });
  });

  describe('updateTodo', () => {
    test('dispatches success action when update succeeds', async () => {
      const id = 1;
      const updates = { completed: true };
      const updatedTodo = { id, title: 'Test todo', completed: true, userId: 1 };
      todoAPI.updateTodo.mockResolvedValue(updatedTodo);

      await actions.updateTodo(mockDispatch)(id, updates);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.UPDATE_TODO_START,
        payload: { id, updates }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.UPDATE_TODO_SUCCESS,
        payload: updatedTodo
      });
    });

    test('dispatches error action when update fails', async () => {
      const id = 1;
      const updates = { completed: true };
      const errorMessage = 'Update failed';
      todoAPI.updateTodo.mockRejectedValue(new Error(errorMessage));

      await actions.updateTodo(mockDispatch)(id, updates);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.UPDATE_TODO_START,
        payload: { id, updates }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.UPDATE_TODO_ERROR,
        payload: { error: errorMessage, id, updates }
      });
    });
  });

  describe('deleteTodo', () => {
    test('dispatches success action when deletion succeeds', async () => {
      const id = 1;
      todoAPI.deleteTodo.mockResolvedValue();

      await actions.deleteTodo(mockDispatch)(id);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.DELETE_TODO_START,
        payload: { id }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.DELETE_TODO_SUCCESS,
        payload: { id }
      });
    });

    test('dispatches error action when deletion fails', async () => {
      const id = 1;
      const errorMessage = 'Deletion failed';
      todoAPI.deleteTodo.mockRejectedValue(new Error(errorMessage));

      await actions.deleteTodo(mockDispatch)(id);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.DELETE_TODO_START,
        payload: { id }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: types.DELETE_TODO_ERROR,
        payload: { error: errorMessage, id }
      });
    });
  });

  describe('clearError', () => {
    test('dispatches clear error action', () => {
      actions.clearError(mockDispatch)();

      expect(mockDispatch).toHaveBeenCalledWith({ type: types.CLEAR_ERROR });
    });
  });
});
