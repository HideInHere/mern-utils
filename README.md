# mern-utils

A lightweight utility library for MERN stack applications, providing commonly used helpers for API integration, state management, and data validation.

## Features

- RESTful API client with built-in error handling
- Form validation utilities with customizable rules
- JWT authentication helpers
- Data transformation and formatting functions
- Request/response interceptors
- LocalStorage manager with encryption support

## Installation

```bash
npm install mern-utils
```

## Quick Start

```javascript
import { apiClient, validateEmail, formatDate } from 'mern-utils';

// Make authenticated API requests
const { data } = await apiClient.get('/api/users', {
  headers: { Authorization: `Bearer ${token}` }
});

// Validate user input
const isValid = validateEmail('user@example.com');

// Format timestamps
const formatted = formatDate(new Date(), 'MM/DD/YYYY');
```

## Configuration

Create a `mern-utils.config.js` in your project root:

```javascript
module.exports = {
  apiBaseURL: process.env.REACT_APP_API_URL,
  tokenKey: 'authToken',
  encryptionEnabled: true
};
```

## License

MIT