const buildQuery = (filters, searchFields = []) => {
  const query = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      query[key] = { $in: value };
    } else if (typeof value === 'string' && value.includes('*')) {
      query[key] = new RegExp(value.replace(/\*/g, '.*'), 'i');
    } else if (typeof value === 'object' && value.min !== undefined) {
      query[key] = {};
      if (value.min !== null) query[key].$gte = value.min;
      if (value.max !== null) query[key].$lte = value.max;
    } else {
      query[key] = value;
    }
  });

  return query;
};

const buildSearch = (term, fields) => {
  if (!term || !fields.length) return {};

  const searchRegex = new RegExp(term, 'i');
  return {
    $or: fields.map(field => ({ [field]: searchRegex }))
  };
};

const buildSort = (sortBy) => {
  if (!sortBy) return { createdAt: -1 };

  const [field, order] = sortBy.split(':');
  return { [field]: order === 'asc' ? 1 : -1 };
};

module.exports = {
  buildQuery,
  buildSearch,
  buildSort,
  executePaginatedQuery: async (model, filters, options = {}) => {
    const {
      page = 1,
      limit = 20,
      search = '',
      sortBy = 'createdAt:desc',
      searchFields = []
    } = options;

    const query = buildQuery(filters, searchFields);
    const searchQuery = buildSearch(search, searchFields);
    const finalQuery = { ...query, ...searchQuery };
    const sort = buildSort(sortBy);

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      model.find(finalQuery).sort(sort).skip(skip).limit(limit).lean(),
      model.countDocuments(finalQuery)
    ]);

    return {
      data,
      pagination: {
        page,