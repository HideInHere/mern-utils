# mern-utils

A collection of reusable utilities and helpers for MERN stack development, including API client wrappers, form validation, authentication helpers, and common middleware.

## Installation

```bash
npm install mern-utils
```

## Setup

```javascript
// Initialize in your Express app
const { setupAuth, errorHandler } = require('mern-utils');

app.use(setupAuth(process.env.JWT_SECRET));
app.use(errorHandler());
```

## Usage

**API Client with Request/Response Interceptors:**
```javascript
import { createApiClient } from 'mern-utils';

const api = createApiClient({
  baseURL: 'http://localhost:5000/api',
  token: localStorage.getItem('token')
});

const response = await api.get('/users');
```

**Form Validation:**
```javascript
import { validateForm } = from 'mern-utils';

const errors = validateForm(userData, {
  email: 'required|email',
  password: 'required|min:8'
});
```

## Features

- JWT authentication middleware
- API client with interceptors
- Form validation rules engine
- Error handling utilities
- Request logging and debugging tools

## License

MIT