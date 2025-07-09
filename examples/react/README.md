# TodoMVC: React with API Integration

A modern implementation of TodoMVC using React 17 with JSONPlaceholder API integration, dark mode support, and comprehensive testing.

## Features

- ✅ **Complete TodoMVC functionality** - Add, edit, delete, and filter todos
- 🌙 **Dark mode toggle** - Beautiful theme switching with smooth animations
- 🔄 **API persistence** - Real data persistence using JSONPlaceholder API
- ⚡ **Optimistic updates** - Instant UI feedback with error handling
- 🧪 **Comprehensive testing** - Unit, integration, and e2e tests
- 📱 **Responsive design** - Works on desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js (minimum version: 18.13.0)
- npm (minimum version: 8.19.3)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohnish2626/todomvc.git
cd todomvc/examples/react

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run serve` | Serve production build locally |
| `npm test` | Run all tests |
| `npm test -- --watch` | Run tests in watch mode |
| `npm test -- --coverage` | Run tests with coverage report |

## Architecture

### State Management

The app uses React's `useReducer` hook for state management with the following structure:

```javascript
{
  todos: [],           // Array of todo items
  theme: 'light',      // Current theme ('light' or 'dark')
  loading: false,      // Global loading state
  creating: false,     // Creating todo state
  updating: null,      // ID of todo being updated
  deleting: null,      // ID of todo being deleted
  error: null          // Error message if any
}
```

### API Integration

The app integrates with [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for data persistence:

- **GET** `/todos` - Fetch all todos
- **POST** `/todos` - Create new todo
- **PATCH** `/todos/:id` - Update existing todo
- **DELETE** `/todos/:id` - Delete todo

### Component Structure

```
App
├── Header (title, theme toggle, new todo input)
├── Main (todo list, loading states, error handling)
│   └── Item (individual todo with edit/delete)
└── Footer (count, filters, clear completed)
```

## Testing

The project includes comprehensive testing with Jest and React Testing Library:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Header.test.jsx
```

### Test Coverage

The project maintains 80% test coverage across:
- **Unit tests** - Individual component testing
- **Integration tests** - API service and action testing
- **E2E tests** - Complete user workflow testing

### Test Structure

```
src/
├── __tests__/
│   └── e2e.test.js                    # End-to-end tests
├── todo/
│   ├── __tests__/
│   │   ├── actions.test.js            # Action creators
│   │   └── reducer.test.js            # State reducer
│   ├── components/__tests__/
│   │   ├── App.test.jsx               # Main app component
│   │   ├── Header.test.jsx            # Header component
│   │   ├── Main.test.jsx              # Main component
│   │   ├── Item.test.jsx              # Todo item component
│   │   ├── Footer.test.jsx            # Footer component
│   │   ├── Input.test.jsx             # Input component
│   │   └── ThemeToggle.test.jsx       # Theme toggle
│   └── services/__tests__/
│       └── api.test.js                # API service
```

## API Documentation

See [API.md](docs/API.md) for detailed API integration documentation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and contribution process.

## Development Workflow

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Write tests first (TDD approach)
3. Implement feature with JSDoc comments
4. Ensure all tests pass: `npm test`
5. Check test coverage: `npm test -- --coverage`
6. Submit pull request

### Code Style

- Use functional components with hooks
- Follow existing naming conventions
- Add JSDoc comments for all public functions
- Maintain 80% test coverage
- Use TypeScript-style prop validation in comments

### Error Handling

The app implements comprehensive error handling:

- **Network errors** - Displayed with dismiss option
- **Optimistic updates** - Rollback on failure
- **Loading states** - Visual feedback during operations
- **Graceful degradation** - App remains functional during errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Bundle size** - Optimized with webpack
- **Loading states** - Immediate user feedback
- **Optimistic updates** - Instant UI responses
- **Error boundaries** - Graceful error handling

## License

MIT License - see the main TodoMVC repository for details.

## Related Documentation

- [API Integration Guide](docs/API.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [TodoMVC Specification](../../app-spec.md)
