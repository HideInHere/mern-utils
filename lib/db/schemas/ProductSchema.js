const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      set: (v) => Math.round(v * 100) / 100,
    },
    inventory: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      views: { type: Number, default: 0 },
      lastRestocked: Date,
      supplier: String,
    },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', category: 1, isActive: 1 });

productSchema.pre('save', async function (next) {
  if (!this.isModified('price')) return next();
  this.price = Math.round(this.price * 100) / 100;
  next();
});

productSchema.methods.isInStock = function () {
  return this.inventory > 0;
};

productSchema.query.active = function () {
  return this.where({ isActive: true });
};

module.exports = mongoose.model('Product', productSchema);