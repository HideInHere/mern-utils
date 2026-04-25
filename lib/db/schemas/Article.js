const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    content: String,
    excerpt: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [String],
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    lastEditedAt: Date,
  },
  { timestamps: true }
);

articleSchema.index({ author: 1, published: 1 });
articleSchema.index({ slug: 1, published: 1 });

articleSchema.pre('findByIdAndUpdate', function (next) {
  this.set({ lastEditedAt: new Date() });
  next();
});

articleSchema.methods.incrementViews = function () {
  return this.updateOne({ $inc: { viewCount: 1 } });
};

module.exports = mongoose.model('Article', articleSchema);