const User = require('../models/User');
const { AppError } = require('../utils/errors');

class UserRepository {
  async findByEmailWithRetry(email, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const user = await User.findOne({ email }).lean();
        return user;
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
        }
      }
    }
    
    throw new AppError(`Failed to fetch user after ${maxRetries} attempts`, 500, lastError);
  }

  async bulkUpdateLastSeen(userIds) {
    if (!userIds.length) return { matched: 0, modified: 0 };
    
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { lastSeenAt: new Date() }
    );
    
    return { matched: result.matchedCount, modified: result.modifiedCount };
  }

  async paginatedSearch(query, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [docs, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).select('-password').lean(),
      User.countDocuments(query)
    ]);
    
    return {
      docs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total
      }
    };
  }
}

module.exports = new UserRepository();