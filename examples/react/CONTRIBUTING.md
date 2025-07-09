# Contributing to React TodoMVC

Thank you for your interest in contributing to the React TodoMVC implementation! This guide will help you get started with development and ensure your contributions align with the project standards.

## Development Setup

### Prerequisites

- Node.js (minimum version: 18.13.0)
- npm (minimum version: 8.19.3)
- Git

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Mohnish2626/todomvc.git
cd todomvc/examples/react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run serve` | Serve production build locally |
| `npm test` | Run all tests |
| `npm test -- --watch` | Run tests in watch mode |
| `npm test -- --coverage` | Generate test coverage report |

## Code Standards

### React Component Guidelines

#### Functional Components
Always use functional components with hooks:

```javascript
// ✅ Good
export function TodoItem({ todo, onToggle }) {
  const handleClick = useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  return (
    <li className={todo.completed ? 'completed' : ''}>
      <input type="checkbox" checked={todo.completed} onChange={handleClick} />
      <span>{todo.title}</span>
    </li>
  );
}

// ❌ Avoid class components
class TodoItem extends React.Component { ... }
```

#### Props and State
- Use destructuring for props
- Prefer `useCallback` for event handlers
- Use `useMemo` for expensive calculations

```javascript
// ✅ Good
export function TodoList({ todos, onToggle, onDelete }) {
  const activeTodos = useMemo(() => 
    todos.filter(todo => !todo.completed), 
    [todos]
  );

  const handleToggle = useCallback((id) => {
    onToggle(id);
  }, [onToggle]);

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onToggle={handleToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
```

### JSDoc Documentation

All exported functions and components must have JSDoc comments:

```javascript
/**
 * Creates a new todo with optimistic updates
 * @param {Function} dispatch - Redux-style dispatch function
 * @returns {Function} Async function that creates a todo
 */
export const createTodo = (dispatch) => async (title) => {
  // Implementation...
};

/**
 * Header component containing the app title and new todo input
 * @param {Object} props - Component props
 * @param {Function} props.dispatch - Dispatch function for actions
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @returns {JSX.Element} Header component
 */
export function Header({ dispatch, theme }) {
  // Implementation...
}
```

### Async Actions Pattern

Follow the established pattern for async actions:

```javascript
export const actionName = (dispatch) => async (params) => {
  // 1. Start action for loading state
  dispatch({ type: ACTION_START, payload: optimisticData });
  
  try {
    // 2. API call
    const result = await api.method(params);
    
    // 3. Success action
    dispatch({ type: ACTION_SUCCESS, payload: result });
  } catch (error) {
    // 4. Error action with rollback
    dispatch({ 
      type: ACTION_ERROR, 
      payload: { error: error.message, ...rollbackData } 
    });
  }
};
```

### State Management

#### Reducer Pattern
- Use immutable updates
- Handle all async states (loading, success, error)
- Implement optimistic updates where appropriate

```javascript
case CREATE_TODO_START:
  return { 
    ...state, 
    todos: [...state.todos, action.payload], // Optimistic update
    creating: true,
    error: null
  };

case CREATE_TODO_SUCCESS:
  return { 
    ...state, 
    todos: state.todos.map(todo => 
      todo.id === action.payload.tempId 
        ? { ...action.payload, id: action.payload.id }
        : todo
    ),
    creating: false 
  };
```

## Testing Guidelines

### Test Structure

Tests should be organized by type:

```
src/
├── __tests__/
│   └── e2e.test.js                    # End-to-end tests
├── todo/
│   ├── __tests__/
│   │   ├── actions.test.js            # Action creators
│   │   └── reducer.test.js            # State reducer
│   ├── components/__tests__/
│   │   └── *.test.jsx                 # Component tests
│   └── services/__tests__/
│       └── api.test.js                # API service tests
```

### Writing Tests

#### Component Tests
Use React Testing Library for component testing:

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../TodoItem';

test('toggles todo when checkbox is clicked', async () => {
  const user = userEvent.setup();
  const mockOnToggle = jest.fn();
  const todo = { id: 1, title: 'Test todo', completed: false };
  
  render(<TodoItem todo={todo} onToggle={mockOnToggle} />);
  
  const checkbox = screen.getByRole('checkbox');
  await user.click(checkbox);
  
  expect(mockOnToggle).toHaveBeenCalledWith(1);
});
```

#### Async Action Tests
Mock API calls and test dispatch sequences:

```javascript
import * as api from '../services/api';
import { createTodo } from '../actions';

jest.mock('../services/api');

test('creates todo successfully', async () => {
  const mockDispatch = jest.fn();
  const mockTodo = { id: 201, title: 'New todo', completed: false };
  
  api.todoAPI.createTodo.mockResolvedValue(mockTodo);
  
  await createTodo(mockDispatch)('New todo');
  
  expect(mockDispatch).toHaveBeenCalledWith({
    type: 'CREATE_TODO_SUCCESS',
    payload: expect.objectContaining(mockTodo)
  });
});
```

#### API Service Tests
Test all CRUD operations with mocked fetch:

```javascript
import { todoAPI } from '../api';

global.fetch = jest.fn();

test('fetches todos successfully', async () => {
  const mockTodos = [{ id: 1, title: 'Test', completed: false }];
  
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockTodos
  });

  const result = await todoAPI.fetchTodos();
  
  expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos');
  expect(result).toEqual(mockTodos);
});
```

### Test Coverage Requirements

Maintain minimum 80% coverage across:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

Run coverage reports:
```bash
npm test -- --coverage
```

## API Integration

### Service Layer
All API calls should go through the service layer:

```javascript
// ✅ Good - Use service layer
import { todoAPI } from './services/api';
const todos = await todoAPI.fetchTodos();

// ❌ Avoid direct fetch calls
const response = await fetch('/api/todos');
```

### Error Handling
Implement comprehensive error handling:

```javascript
try {
  const result = await todoAPI.createTodo(todo);
  dispatch({ type: 'SUCCESS', payload: result });
} catch (error) {
  // Show user-friendly error message
  dispatch({ 
    type: 'ERROR', 
    payload: { error: 'Failed to create todo. Please try again.' } 
  });
}
```

### Optimistic Updates
Implement optimistic updates for better UX:

1. **Immediate UI update** with temporary data
2. **API call** in background
3. **Replace or rollback** based on result

## Pull Request Process

### Before Submitting

1. **Run all tests**: `npm test`
2. **Check coverage**: `npm test -- --coverage`
3. **Build successfully**: `npm run build`
4. **Manual testing**: Test your changes in the browser
5. **Update documentation**: If you changed APIs or added features

### PR Requirements

- **Clear title**: Describe what the PR does
- **Detailed description**: Explain the changes and why
- **Test coverage**: Ensure new code is tested
- **Documentation**: Update relevant docs
- **No breaking changes**: Unless explicitly discussed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Coverage maintained/improved

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] JSDoc comments added
- [ ] Tests added/updated
- [ ] Documentation updated
```

## Code Review Guidelines

### As a Reviewer

- **Test the changes**: Don't just read the code
- **Check test coverage**: Ensure adequate testing
- **Verify documentation**: Make sure docs are updated
- **Consider edge cases**: Think about error scenarios
- **Performance impact**: Consider bundle size and runtime performance

### As an Author

- **Respond promptly**: Address feedback quickly
- **Ask questions**: If feedback is unclear, ask for clarification
- **Test suggestions**: Verify that suggested changes work
- **Update tests**: If you change implementation, update tests

## Common Patterns

### Component Composition

```javascript
// ✅ Good - Composable components
export function TodoApp() {
  return (
    <div className="todoapp">
      <Header onAdd={handleAdd} />
      <Main todos={todos} onToggle={handleToggle} />
      <Footer todos={todos} onClear={handleClear} />
    </div>
  );
}
```

### Custom Hooks

```javascript
// ✅ Good - Extract logic into custom hooks
function useTodos() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  const addTodo = useCallback((title) => {
    dispatch({ type: 'ADD_TODO', payload: { title } });
  }, []);
  
  return { todos: state.todos, addTodo };
}
```

### Event Handling

```javascript
// ✅ Good - Use useCallback for event handlers
const handleSubmit = useCallback((event) => {
  event.preventDefault();
  const title = event.target.title.value.trim();
  if (title) {
    onAdd(title);
    event.target.reset();
  }
}, [onAdd]);
```

## Performance Guidelines

### Bundle Size
- Keep dependencies minimal
- Use tree shaking where possible
- Analyze bundle with `npm run build`

### Runtime Performance
- Use `React.memo` for expensive components
- Implement `useCallback` and `useMemo` appropriately
- Avoid creating objects in render

### Loading States
- Show immediate feedback for user actions
- Implement skeleton screens for loading
- Use optimistic updates where appropriate

## Accessibility

### Requirements
- All interactive elements must be keyboard accessible
- Provide appropriate ARIA labels
- Maintain proper heading hierarchy
- Ensure sufficient color contrast

### Testing
- Test with keyboard navigation
- Use screen reader testing tools
- Validate with accessibility linters

## Browser Support

### Target Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Testing
- Test in multiple browsers
- Use feature detection, not browser detection
- Provide graceful degradation

## Deployment

### Build Process
```bash
npm run build
```

### Environment Variables
- No sensitive data in client-side code
- Use environment-specific configurations
- Document required environment variables

## Getting Help

### Resources
- [React Documentation](https://reactjs.org/docs)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

### Communication
- Open GitHub issues for bugs
- Start discussions for feature requests
- Ask questions in PR comments

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).
