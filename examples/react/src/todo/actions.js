import { todoAPI } from './services/api';
import * as types from './constants';

export const fetchTodos = (dispatch) => async () => {
  dispatch({ type: types.FETCH_TODOS_START });
  try {
    const todos = await todoAPI.fetchTodos();
    dispatch({ type: types.FETCH_TODOS_SUCCESS, payload: todos });
  } catch (error) {
    dispatch({ type: types.FETCH_TODOS_ERROR, payload: error.message });
  }
};

export const createTodo = (dispatch) => async (title) => {
  const tempId = `temp-${Date.now()}`;
  const optimisticTodo = { id: tempId, title, completed: false, userId: 1 };
  
  dispatch({ type: types.CREATE_TODO_START, payload: optimisticTodo });
  try {
    const todo = await todoAPI.createTodo({ title, completed: false, userId: 1 });
    dispatch({ type: types.CREATE_TODO_SUCCESS, payload: { ...todo, tempId } });
  } catch (error) {
    dispatch({ type: types.CREATE_TODO_ERROR, payload: { error: error.message, tempId } });
  }
};

export const updateTodo = (dispatch) => async (id, updates) => {
  dispatch({ type: types.UPDATE_TODO_START, payload: { id, updates } });
  try {
    const todo = await todoAPI.updateTodo(id, updates);
    dispatch({ type: types.UPDATE_TODO_SUCCESS, payload: todo });
  } catch (error) {
    dispatch({ type: types.UPDATE_TODO_ERROR, payload: { error: error.message, id, updates } });
  }
};

export const deleteTodo = (dispatch) => async (id) => {
  dispatch({ type: types.DELETE_TODO_START, payload: { id } });
  try {
    await todoAPI.deleteTodo(id);
    dispatch({ type: types.DELETE_TODO_SUCCESS, payload: { id } });
  } catch (error) {
    dispatch({ type: types.DELETE_TODO_ERROR, payload: { error: error.message, id } });
  }
};

export const clearError = (dispatch) => () => {
  dispatch({ type: types.CLEAR_ERROR });
};
