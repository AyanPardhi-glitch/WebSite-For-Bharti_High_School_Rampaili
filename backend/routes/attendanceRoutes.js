const express = require("express");
const router = express.Router();

const {
  saveAttendance,
  getAttendance,
  getAllClassesAttendance,
  getStudentAttendance,
  getAttendanceByStudentId,
} = require("../controller/AttendanceController");

// ✅ SAVE / UPDATE
router.post("/save", saveAttendance);

// ✅ GET by class + date
router.get("/get", getAttendance);

// ✅ ALL CLASSES SUMMARY
router.get("/all-classes", getAllClassesAttendance);

// ✅ 🔥 STUDENT DASHBOARD (FIXED PARAM)
router.get("/student/:studentId", getStudentAttendance);

// ✅ 🔥 HISTORY (NO CONFLICT)
router.get("/history/:studentId", getAttendanceByStudentId);

module.exports = router;