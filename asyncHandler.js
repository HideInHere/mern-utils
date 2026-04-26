const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

const formatPaginatedResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
};

const sanitizeUser = (user) => {
  const { password, __v, ...safe } = user.toObject();
  return safe;
};

const createAppError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = {
  asyncHandler,
  validateObjectId,
  getPaginationParams,
  formatPaginatedResponse,
  sanitizeUser,
  createAppError,
};