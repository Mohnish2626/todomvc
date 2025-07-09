# API Integration Documentation

This document describes the JSONPlaceholder API integration in the React TodoMVC application.

## Overview

The TodoMVC React app integrates with [JSONPlaceholder](https://jsonplaceholder.typicode.com/), a fake REST API for testing and prototyping. This provides realistic API behavior for demonstrating CRUD operations, error handling, and optimistic updates.

## API Service

The API service is located in `src/todo/services/api.js` and provides a clean interface for all HTTP operations.

### Base Configuration

```javascript
const API_BASE = 'https://jsonplaceholder.typicode.com';
```

## CRUD Operations

### Fetch Todos

Retrieves all todos from the API.

**Endpoint:** `GET /todos`

**Usage:**
```javascript
import { todoAPI } from './services/api';

const todos = await todoAPI.fetchTodos();
```

**Response:**
```javascript
[
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  // ... more todos
]
```

**Error Handling:**
- Network failures throw with original error message
- HTTP errors throw "Failed to fetch todos"

### Create Todo

Creates a new todo item.

**Endpoint:** `POST /todos`

**Usage:**
```javascript
const newTodo = await todoAPI.createTodo({
  title: 'Learn React',
  completed: false,
  userId: 1
});
```

**Request Body:**
```javascript
{
  "title": "Learn React",
  "completed": false,
  "userId": 1
}
```

**Response:**
```javascript
{
  "id": 201,
  "title": "Learn React",
  "completed": false,
  "userId": 1
}
```

**Error Handling:**
- Network failures throw with original error message
- HTTP errors throw "Failed to create todo"

### Update Todo

Updates an existing todo item.

**Endpoint:** `PATCH /todos/:id`

**Usage:**
```javascript
const updatedTodo = await todoAPI.updateTodo(1, {
  completed: true
});
```

**Request Body:**
```javascript
{
  "completed": true
}
```

**Response:**
```javascript
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": true
}
```

**Error Handling:**
- Network failures throw with original error message
- HTTP errors throw "Failed to update todo"

### Delete Todo

Deletes a todo item.

**Endpoint:** `DELETE /todos/:id`

**Usage:**
```javascript
await todoAPI.deleteTodo(1);
```

**Response:** Empty (204 No Content)

**Error Handling:**
- Network failures throw with original error message
- HTTP errors throw "Failed to delete todo"

## Async Actions

The app uses async action creators that handle API calls and dispatch appropriate actions based on success or failure.

### Action Flow

1. **Start Action** - Dispatched immediately to show loading state
2. **API Call** - Actual HTTP request to JSONPlaceholder
3. **Success/Error Action** - Dispatched based on API response

### Example: Create Todo Flow

```javascript
// 1. Optimistic update - immediately add todo to UI
dispatch({
  type: 'CREATE_TODO_START',
  payload: { id: 'temp-123', title: 'New todo', completed: false }
});

try {
  // 2. API call
  const todo = await todoAPI.createTodo({
    title: 'New todo',
    completed: false,
    userId: 1
  });
  
  // 3. Success - replace temporary todo with real one
  dispatch({
    type: 'CREATE_TODO_SUCCESS',
    payload: { ...todo, tempId: 'temp-123' }
  });
} catch (error) {
  // 3. Error - remove temporary todo and show error
  dispatch({
    type: 'CREATE_TODO_ERROR',
    payload: { error: error.message, tempId: 'temp-123' }
  });
}
```

## Optimistic Updates

The app implements optimistic updates for better user experience:

### Create Todo
- Immediately adds todo to UI with temporary ID
- Replaces with real todo when API responds
- Removes temporary todo if API fails

### Update Todo
- Immediately updates todo in UI
- Reverts changes if API fails
- Shows loading indicator during update

### Delete Todo
- Keeps todo in UI with loading state
- Removes todo when API confirms deletion
- Restores todo if deletion fails

## Error Handling

### Error Types

1. **Network Errors** - Connection failures, timeouts
2. **HTTP Errors** - 4xx/5xx status codes
3. **Parsing Errors** - Invalid JSON responses

### Error Display

Errors are displayed in the UI with:
- Clear error message
- Dismiss button (×)
- Non-blocking design (app remains functional)

### Error Recovery

- **Retry mechanism** - Users can retry failed operations
- **Graceful degradation** - App works without API
- **State restoration** - Failed optimistic updates are reverted

## State Management

### Loading States

The app tracks multiple loading states:

```javascript
{
  loading: false,      // Global loading (initial fetch)
  creating: false,     // Creating new todo
  updating: 123,       // ID of todo being updated
  deleting: 456,       // ID of todo being deleted
  error: null          // Current error message
}
```

### Action Types

```javascript
// Fetch todos
FETCH_TODOS_START
FETCH_TODOS_SUCCESS
FETCH_TODOS_ERROR

// Create todo
CREATE_TODO_START
CREATE_TODO_SUCCESS
CREATE_TODO_ERROR

// Update todo
UPDATE_TODO_START
UPDATE_TODO_SUCCESS
UPDATE_TODO_ERROR

// Delete todo
DELETE_TODO_START
DELETE_TODO_SUCCESS
DELETE_TODO_ERROR

// Error handling
CLEAR_ERROR
```

## Testing API Integration

### Mocking API Calls

Tests use Jest mocks for the API service:

```javascript
import * as api from '../services/api';

jest.mock('../services/api');

beforeEach(() => {
  api.todoAPI.fetchTodos.mockResolvedValue([
    { id: 1, title: 'Test todo', completed: false }
  ]);
});
```

### Testing Async Actions

```javascript
test('creates todo successfully', async () => {
  const mockTodo = { id: 201, title: 'New todo', completed: false };
  api.todoAPI.createTodo.mockResolvedValue(mockTodo);

  await actions.createTodo(mockDispatch)('New todo');

  expect(mockDispatch).toHaveBeenCalledWith({
    type: 'CREATE_TODO_SUCCESS',
    payload: expect.objectContaining(mockTodo)
  });
});
```

### Testing Error Scenarios

```javascript
test('handles creation error', async () => {
  api.todoAPI.createTodo.mockRejectedValue(new Error('Network error'));

  await actions.createTodo(mockDispatch)('New todo');

  expect(mockDispatch).toHaveBeenCalledWith({
    type: 'CREATE_TODO_ERROR',
    payload: expect.objectContaining({
      error: 'Network error'
    })
  });
});
```

## Performance Considerations

### Request Optimization

- **Debouncing** - Rapid updates are debounced
- **Caching** - Initial todos are cached
- **Minimal payloads** - Only changed fields are sent

### Loading States

- **Immediate feedback** - Loading states show instantly
- **Progressive enhancement** - App works without JavaScript
- **Graceful degradation** - Fallback for API failures

## Security Considerations

### Data Validation

- **Input sanitization** - User input is validated
- **Type checking** - API responses are validated
- **Error boundaries** - Prevent app crashes

### API Safety

- **HTTPS only** - All API calls use HTTPS
- **No sensitive data** - No authentication required
- **Rate limiting** - Respectful API usage

## Limitations

### JSONPlaceholder Limitations

- **Fake API** - Changes don't persist between sessions
- **Limited data** - Only 200 todos available
- **No authentication** - No user-specific data
- **Simulated responses** - Some operations are simulated

### Workarounds

- **Local state** - Changes persist during session
- **Optimistic updates** - Immediate UI feedback
- **Error simulation** - Test error handling locally

## Future Enhancements

### Potential Improvements

- **Real backend** - Replace with actual API
- **Authentication** - Add user accounts
- **Offline support** - Service worker integration
- **Real-time updates** - WebSocket integration
- **Pagination** - Handle large todo lists
- **Search/filtering** - Server-side filtering

### Migration Path

To migrate to a real API:

1. Update `API_BASE` constant
2. Add authentication headers
3. Update error handling for new error formats
4. Add request/response transformers if needed
5. Update tests with new API behavior

## Troubleshooting

### Common Issues

**Network errors:**
- Check internet connection
- Verify JSONPlaceholder is accessible
- Check browser console for CORS issues

**State inconsistencies:**
- Check reducer logic for action handling
- Verify optimistic update rollback
- Check for race conditions in async actions

**Test failures:**
- Ensure API mocks are properly configured
- Check for async/await issues in tests
- Verify mock implementations match real API

### Debug Tools

- **Redux DevTools** - Inspect state changes
- **Network tab** - Monitor API calls
- **Console logs** - Debug action flow
- **React DevTools** - Inspect component state
