const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  className: String,
  subject: String,
  marks: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// 🔥 UNIQUE INDEX: Prevent duplicate (studentId + subject + className)
resultSchema.index({ studentId: 1, subject: 1, className: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);