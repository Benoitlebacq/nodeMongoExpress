const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");

// @desc        get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
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
  query = Bootcamp.find(JSON.parse(queryStr));

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
  const limit = parseInt(req.query.limit) || 1; // to test we put the limit to 1 per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // executing query
  const bootcamps = await query;

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
  res.status(200).json({
    sucess: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps
  });
});

// @desc        get single bootcamps
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ sucess: true, data: bootcamp });
});

// @desc        create a new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ sucess: true, data: bootcamp });
});

// @desc        update a bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ sucess: true, data: bootcamp });
});
// @desc        delete a bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ sucess: true, data: {} });
});

// @desc        get bootcamps within  radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // GET lat/long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc radius using radians
  // Divide distance by radius of earth
  // Earth average radius = 6371 km
  const radius = distance / 6371;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
