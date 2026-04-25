const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const validatePagination = (query) => {
  let { page = 1, limit = 20, sort = '-createdAt' } = query;
  
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit) || 20));
  
  return { page, limit, skip: (page - 1) * limit, sort };
};

const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    total,
  };
};

module.exports = {
  asyncHandler,
  validatePagination,
  getPaginationMeta,
};