# mern-utils

A lightweight utility library for MERN stack development. Provides essential helpers for authentication, API calls, validation, and state management to accelerate development workflows.

## Installation

```bash
npm install mern-utils
```

## Quick Start

```javascript
import { validateEmail, asyncHandler, withAuth } from 'mern-utils';

// Validate email
if (validateEmail('user@example.com')) {
  console.log('Valid email');
}

// Wrap async route handlers to catch errors
const handler = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Protect routes with authentication middleware
app.get('/profile', withAuth, (req, res) => {
  res.json(req.user);
});
```

## Features

- Email, phone, and password validation utilities
- Async error handling middleware
- JWT authentication helpers
- API response formatting
- Environment configuration loader
- Request rate limiting utilities

## Documentation

Full documentation available at [docs/](./docs/)

## License

MIT