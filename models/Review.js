const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "please add a title to the review"],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, "please add a text"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "please add a rating between 1 and 10"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId, // link the bootcamp with the id
    ref: "Bootcamp", // tell with schema where the bootcamp can be founded
    required: true // every course should have a bootcamp
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

// user can add only 1 review for 1 bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
