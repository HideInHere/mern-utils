const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

# filename: models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tags: [String],
    published: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastModifiedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

postSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

postSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);

# filename: utils/pagination.js

const getPaginationParams = (query) => {
  let page = Math.max(1, parseInt(query.page) || 1);
  let limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

const buildPaginatedResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

module.exports = { getPaginationParams, buildPaginatedResponse };