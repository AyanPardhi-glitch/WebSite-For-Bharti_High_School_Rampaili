const express = require("express");
const router = express.Router();

const {
  dashboardHandler,
  registerHandler,
  loginHandler,
  getAllTeachersHandler,
  getTeacherCount,
  addAssignment,
  getSubjectsByClass,
  
  addResult
} = require("../controller/TeacherController");

// AUTH
router.post("/register", registerHandler);
router.post("/login", loginHandler);

// DASHBOARD
router.get("/dashboard", dashboardHandler);

// TEACHERS
router.get("/all", getAllTeachersHandler);
router.get("/count", getTeacherCount);

// 🔥 SUBJECTS (IMPORTANT FIX)
router.get("/subjects/:className", getSubjectsByClass);

// 🔥 ASSIGNMENT (FIXED ROUTE)
router.post("/assignment/add", addAssignment);


router.post("/result/add", addResult);

module.exports = router;