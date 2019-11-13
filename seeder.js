const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotEnv = require("dotEnv");

// Load env vars
dotEnv.config({ path: "./config/config.env" });

// load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Course.create(courses);
    await Bootcamp.create(bootcamps);

    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err.red);
    console.log("bouboj");
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("Data deleted...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err.red);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
