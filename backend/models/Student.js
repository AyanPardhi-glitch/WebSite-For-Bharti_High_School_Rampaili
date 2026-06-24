const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true },

    firstName: String,
    lastName: String,
    gender: String,
    dob: Date,
    admissionDate: Date,

    status: { type: String, default: "Admitted" },
    tcIssued: { type: String, default: "No" },

    email: { type: String, unique: true },
    phone: String,
    password: String,

    studentClass: String,
    medium: String,

    address: String,
    city: String,
    state: String,
    pincode: String,

    aadhar_no: String,
    account_no: String,
    ifc_code: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);