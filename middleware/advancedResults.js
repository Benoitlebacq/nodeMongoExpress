const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  // Field to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  // create operator ($gt $ lt , etc...)
  queryStr = queryStr.replace(/\b(gt|gte|lte|lt|in)\b/g, match => `$${match}`);

  //Finding ressource
  query = model.find(JSON.parse(queryStr)); // we can also pass a object with the selected field we want the courses to display

  // select fields must be added with a space between them
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25; // to test the pagination we can set the limit to 1 per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
