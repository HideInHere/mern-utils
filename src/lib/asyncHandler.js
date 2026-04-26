const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

# filename: utils/pagination.js

const calculatePagination = (page = 1, limit = 20) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  return { skip, limit: limitNum, page: pageNum };
};

const paginate = (query, page, limit) => {
  const { skip, limit: paginationLimit } = calculatePagination(page, limit);
  return query.skip(skip).limit(paginationLimit);
};

const buildPaginationMeta = (total, page, limit) => {
  const { limit: paginationLimit } = calculatePagination(page, limit);
  const pages = Math.ceil(total / paginationLimit);

  return {
    total,
    page: parseInt(page, 10) || 1,
    limit: paginationLimit,
    pages,
    hasNextPage: page < pages,
    hasPrevPage: page > 1,
  };
};

module.exports = { calculatePagination, paginate, buildPaginationMeta };

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
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [{ type: String, lowercase: true }],
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    viewCount: {
      type: Number,