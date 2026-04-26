class QueryBuilder {
  constructor(query, filters) {
    this.query = query;
    this.filters = filters;
  }

  search() {
    if (this.filters.search) {
      this.query = this.query.find({
        $or: [
          { title: { $regex: this.filters.search, $options: 'i' } },
          { description: { $regex: this.filters.search, $options: 'i' } }
        ]
      });
    }
    return this;
  }

  filter() {
    const filterObj = { ...this.filters };
    const excludedFields = ['search', 'sort', 'page', 'limit'];
    excludedFields.forEach(field => delete filterObj[field]);

    let filterStr = JSON.stringify(filterObj);
    filterStr = filterStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    this.query = this.query.find(JSON.parse(filterStr));
    return this;
  }

  sort() {
    if (this.filters.sort) {
      const sortBy = this.filters.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.filters.page, 10) || 1;
    const limit = parseInt(this.filters.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit, skip };
    return this;
  }

  async execute() {
    const docs = await this.query;
    const total = await this.query.model.countDocuments(this.query.getFilter());
    
    return {
      docs,
      pagination: {
        ...this.pagination,
        total,
        pages: Math.ceil(total / this.pagination.limit)
      }
    };
  }
}

module.exports = QueryBuilder;