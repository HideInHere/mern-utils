const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

# filename: src/models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

postSchema.query.active = function () {
  return this.where({ deletedAt: null });
};

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ slug: 1 });

module.exports = mongoose.model('Post', postSchema);

# filename: src/utils/pagination.js

const getPaginationParams = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 10, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildPaginationMeta = (page, limit, total) => ({
  total,
  pages: Math.ceil(total / limit),
  currentPage: page,
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

module.exports = { getPaginationParams, buildPaginationMeta