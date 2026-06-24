const express = require("express");
const router = express.Router();

const {
  dashboardHandler,
  registerHandler,
  loginHandler,
  getStudentsByClass,
  addStudent,
  getAllStudentsHandler,
  getStudentSubjects,
  
  getAssignmentsByClass,
  getAllClasses,
  getStudentById,
} = require("../controller/StudentController");

// ================= AUTH =================
router.post("/register", registerHandler);
router.post("/login", loginHandler);

// ================= STUDENT =================
router.get("/all", getAllStudentsHandler);
router.get("/dashboard", dashboardHandler);
router.post("/add", addStudent);

// ✅ STATIC ROUTES (TOP PE)
router.get("/classes", getAllClasses);
router.get("/subjects/:id", getStudentSubjects);
router.get("/class/:className", getStudentsByClass);

// ================= ASSIGNMENT =================

router.get("/assignment/:className", getAssignmentsByClass);

router.get("/byClass/:className", getStudentsByClass);

// ================= LAST (IMPORTANT) =================
router.get("/:id", getStudentById);

module.exports = router;