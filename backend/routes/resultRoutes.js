const express = require("express");
const router = express.Router();

const {
  addMarks,
  generateResult,
  generateClassResult,
  getClassResult,   // ✅ add
  getFinalResult,
  downloadResult,
} = require("../controller/ResultController");

// ✅ routes
router.post("/add-marks", addMarks);
router.post("/generate", generateResult);
router.post("/generate-class", generateClassResult);  // 🔥 FIX
router.get("/class-result/:className", getClassResult); // 🔥 MAIN FIX
router.get("/download/:studentId/:type", downloadResult);
router.get("/final/:studentId", getFinalResult);

module.exports = router;