const mongoose = require("mongoose");

const finalResultSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  className: String,

  subjects: [
    {
      subject: String,
      marks: Number,
      totalMarks: Number
    }
  ],

  totalObtained: Number,
  totalMarks: Number,
  percentage: Number,
  grade: String,

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("FinalResult", finalResultSchema);