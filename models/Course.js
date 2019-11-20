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
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

// static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { boocamp: bootcampId }
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" }
      }
    }
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
CourseSchema.post("save", function() {
  this.constructor.getAverageCost(this.boocamp);
});
// Call getAverageCost before remove
CourseSchema.pre("remove", function() {
  this.constructor.getAverageCost(this.boocamp);
});

module.exports = mongoose.model("Course", CourseSchema);
