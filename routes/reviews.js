const express = require("express");
const { getReview, getReviews } = require("../controllers/reviews");

const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

// Protect middleware
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(
  advancedResults(Review, {
    path: "bootcamp",
    select: "name description"
  }),
  getReviews
);
router.route("/:id").get(getReview);
// //   .put(protect, authorize("publisher", "admin"), updateCourse)
// //   .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
