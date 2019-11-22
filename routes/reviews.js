const express = require("express");
const {
  getReview,
  getReviews,
  addReview,
  updateReview,
  deleteReview
} = require("../controllers/reviews");

const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

// Protect middleware
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description"
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), addReview);
router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview);
// //   .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;