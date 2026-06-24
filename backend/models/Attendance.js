const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  className: String,
  date: Date,
  records: Object, // { studentId: "Present/Absent" }
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);