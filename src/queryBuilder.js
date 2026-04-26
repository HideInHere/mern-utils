export class QueryBuilder {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(searchFields = ['name', 'description']) {
    if (this.queryStr.search) {
      const searchRegex = new RegExp(this.queryStr.search, 'i');
      this.query = this.query.find({
        $or: searchFields.map(field => ({ [field]: searchRegex }))
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['search', 'page', 'limit', 'sort'];
    excludeFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, op => `$${op}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }

  async execute() {
    return this.query.exec();
  }
}