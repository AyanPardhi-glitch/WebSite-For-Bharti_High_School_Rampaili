const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  className: String,

  // 🔥 FIXED: full object store hoga (subject + teacher)
  data: {
    type: Object,
    default: {}
  },
});

module.exports = mongoose.model("Timetable", timetableSchema);