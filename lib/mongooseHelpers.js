export const applyFilters = (query, filters) => {
  if (!filters || Object.keys(filters).length === 0) return query;

  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;

    if (Array.isArray(value)) {
      query.in(key, value);
    } else if (typeof value === 'object' && value.min !== undefined) {
      query.gte(key, value.min);
      if (value.max !== undefined) query.lte(key, value.max);
    } else if (typeof value === 'string' && value.includes('%')) {
      query.regex(key, new RegExp(value.replace(/%/g, '.*'), 'i'));
    } else {
      query.equals(key, value);
    }
  });

  return query;
};

export const buildPaginationMeta = (total, limit, page) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    total,
    limit,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};

export const withPagination = async (query, { limit = 20, page = 1 } = {}) => {
  const numLimit = Math.min(parseInt(limit) || 20, 100);
  const numPage = Math.max(parseInt(page) || 1, 1);
  const skip = (numPage - 1) * numLimit;

  const [data, total] = await Promise.all([
    query.clone().limit(numLimit).skip(skip).lean(),
    query.clone().countDocuments(),
  ]);

  return {
    data,
    meta: buildPaginationMeta(total, numLimit, numPage),
  };
};