// models/Assignment.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  className: String,
  subject: String,
  text: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Assignment", assignmentSchema); 