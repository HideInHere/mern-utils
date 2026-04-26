const mongoose = require('mongoose');

const handleMongooseError = (err) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(e => e.message);
    return {
      status: 400,
      message: 'Validation failed',
      errors: messages
    };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return {
      status: 409,
      message: `${field} already exists`,
      field
    };
  }

  if (err instanceof mongoose.Error.CastError) {
    return {
      status: 400,
      message: 'Invalid ID format'
    };
  }

  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    return {
      status: 404,
      message: 'Document not found'
    };
  }

  return {
    status: 500,
    message: err.message || 'Database error'
  };
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const error = handleMongooseError(err);
    res.status(error.status).json(error);
  });
};

module.exports = { handleMongooseError, asyncHandler };