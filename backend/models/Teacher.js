const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    id: String,
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: String,
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    gender: { type: String, enum: ["Male", "Female"] },
    qualification: String,
    experience: String,
    account: String,
    ifsc: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);