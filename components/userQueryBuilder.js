const buildUserQuery = (filters, options = {}) => {
  const query = {};
  const { sortBy = '-createdAt', limit = 20, skip = 0 } = options;

  if (filters.email) {
    query.email = { $regex: filters.email, $options: 'i' };
  }

  if (filters.status && ['active', 'inactive', 'suspended'].includes(filters.status)) {
    query.status = filters.status;
  }

  if (filters.role && Array.isArray(filters.role)) {
    query.role = { $in: filters.role };
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

  if (filters.lastLoginDays) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(filters.lastLoginDays));
    query.lastLogin = { $gte: daysAgo };
  }

  return {
    exec: async (User) => {
      try {
        const [data, total] = await Promise.all([
          User.find(query)
            .sort(sortBy)
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .lean(),
          User.countDocuments(query),
        ]);

        return {
          data,
          pagination: {
            total,
            limit: parseInt(limit),
            skip: parseInt(skip),
            pages: Math.ceil(total / parseInt(limit)),
          },
        };
      } catch (error) {
        throw new Error(`Query execution failed: ${error.message}`);
      }
    },
  };
};

module.exports = buildUserQuery;