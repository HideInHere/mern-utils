# mern-utils

A lightweight utility library for MERN stack applications. Provides common helpers for API communication, state management, validation, and data transformation.

## Features

- **API Client**: Pre-configured axios wrapper with automatic token handling
- **Validators**: Email, URL, and schema validation utilities
- **Middleware**: CORS and error handling helpers
- **Hooks**: Custom React hooks for authentication, loading states, and data fetching
- **Formatters**: Date, currency, and string formatting functions

## Installation

```bash
npm install mern-utils
```

## Quick Start

```javascript
// Using the API client
import { apiClient } from 'mern-utils';

const fetchUsers = async () => {
  const response = await apiClient.get('/api/users');
  return response.data;
};

// Using validators
import { isValidEmail, validateSchema } from 'mern-utils';

if (isValidEmail(email)) {
  console.log('Valid email');
}

// Using custom hooks
import { useApi } from 'mern-utils';

function UserList() {
  const { data, loading, error } = useApi('/api/users');
  return loading ? <p>Loading...</p> : <div>{data.map(u => u.name)}</div>;
}
```

## Documentation

See [docs](./docs) for complete API reference.

## License

MIT