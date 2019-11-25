const express = require("express");
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

// Protect middleware
const { protect, authorize } = require("../middleware/auth");

// Every route below this , will have protect and authorize amdin
router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .delete(deleteUser)
  .put(updateUser);

module.exports = router;
