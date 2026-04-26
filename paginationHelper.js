const calculatePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const paginate = async (query, options = {}) => {
  const { page, limit, skip } = calculatePagination(query);
  const { sortBy = '-createdAt', searchField, searchValue } = options;

  let filter = {};
  if (searchField && searchValue) {
    filter[searchField] = new RegExp(searchValue, 'i');
  }

  const [data, total] = await Promise.all([
    query.skip(skip).limit(limit).sort(sortBy).lean(),
    query.model.countDocuments(filter),
  ]);

  const pages = Math.ceil(total / limit);
  const hasNextPage = page < pages;
  const hasPrevPage = page > 1;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNextPage,
      hasPrevPage,
    },
  };
};

module.exports = {
  calculatePagination,
  paginate,
};