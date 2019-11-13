const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "please add a course title"]
  },
  description: {
    type: String,
    required: [true, "please add a description"]
  },
  weeks: {
    type: String,
    required: [true, "please add add number of weeks"]
  },
  tuition: {
    type: Number,
    required: [true, "please add a tuition cost"]
  },
  minimumSkill: {
    type: String,
    required: [true, "please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"]
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId, // link the bootcamp with the id
    ref: "Bootcamp", // tell with schema where the bootcamp can be founded
    required: true // every course should have a bootcamp
  }
});

module.exports = mongoose.model("Course", CourseSchema);
