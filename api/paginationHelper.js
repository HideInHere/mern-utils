const getPaginatedResults = async (model, page = 1, limit = 10, filter = {}, sort = { createdAt: -1 }) => {
  try {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      model.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    };
  } catch (error) {
    throw new Error(`Pagination error: ${error.message}`);
  }
};

const validatePaginationParams = (page, limit) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
  
  return { page: validPage, limit: validLimit };
};

module.exports = { getPaginatedResults, validatePaginationParams };