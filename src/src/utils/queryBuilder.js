export class QueryBuilder {
  constructor(query, filters) {
    this.query = query;
    this.filters = filters;
  }

  search(searchFields = []) {
    if (this.filters.search && searchFields.length > 0) {
      const searchRegex = new RegExp(this.filters.search, 'i');
      this.query = this.query.or(
        searchFields.map(field => ({ [field]: searchRegex }))
      );
    }
    return this;
  }

  sort() {
    const sortBy = this.filters.sortBy || '-createdAt';
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const page = Math.max(1, parseInt(this.filters.page) || 1);
    const limit = Math.min(100, parseInt(this.filters.limit) || 20);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }

  select() {
    if (this.filters.fields) {
      const fields = this.filters.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  async execute() {
    const data = await this.query.lean();
    const total = await this.query.model.countDocuments(this.query.getFilter());
    
    return {
      data,
      pagination: {
        total,
        page: this.page,
        limit: this.limit,
        pages: Math.ceil(total / this.limit)
      }
    };
  }
}