const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    salary: { type: Number, required: true },
    image: { type: String, required: true },
    domain: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      ref: "location",
    },
    wfh: { type: Boolean, default: false },
    full_time: { type: Boolean, default: false },
    part_time: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Job = mongoose.model("job", jobSchema);

module.exports = Job;