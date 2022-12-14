class AdvanceApi {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    console.log(this);
  }

  filter = () => {
    // 1a. Filtering (on a shallow copy of req.query)
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // 1b. Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|regex|options|all|in|exists|not|size|or|text|search)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this; // returns the entire object
  };

  // 2. Sorting (on req.query itself)
  sort = () => {
    if (this.queryString.sort) {
      console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  };

  // 3. Field limiting
  limit = () => {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  };

  // 4. Pagination
  paginate = () => {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 25;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  };
}

export default AdvanceApi;
