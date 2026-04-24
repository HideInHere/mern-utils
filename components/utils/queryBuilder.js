const buildQuery = (filters, searchFields = []) => {
  const query = {};

  if (filters.search && searchFields.length > 0) {
    query.$or = searchFields.map(field => ({
      [field]: { $regex: filters.search, $options: 'i' }
    }));
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.createdAfter || filters.createdBefore) {
    query.createdAt = {};
    if (filters.createdAfter) {
      query.createdAt.$gte = new Date(filters.createdAfter);
    }
    if (filters.createdBefore) {
      query.createdAt.$lte = new Date(filters.createdBefore);
    }
  }

  if (filters.category && Array.isArray(filters.category)) {
    query.category = { $in: filters.category };
  }

  return query;
};

const buildSort = (sortBy = 'createdAt', order = -1) => {
  const validFields = ['createdAt', 'updatedAt', 'name', 'title'];
  const field = validFields.includes(sortBy) ? sortBy : 'createdAt';
  const direction = order === 1 ? 1 : -1;
  return { [field]: direction };
};

module.exports = {
  buildQuery,
  buildSort
};