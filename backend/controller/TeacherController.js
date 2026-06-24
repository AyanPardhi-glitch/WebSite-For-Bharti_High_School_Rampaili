const Teacher = require("../models/Teacher");
const Timetable = require("../models/Timetable");
const Assignment = require("../models/Assigment");
const Result = require("../models/Result");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

// ================= DASHBOARD =================
const dashboardHandler = (req, res) => {
  res.send("Teacher Dashboard Working ✅");
};

// ================= REGISTER =================
const registerHandler = async (req, res) => {
  try {
    let { name, fatherName, mobile, email, password } = req.body;

    email = email.toLowerCase().trim();
    password = password.trim();

    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ status: false, message: "Email exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      ...req.body,
      email,
      password: hashedPassword,
    });

    res.json({ status: true, data: teacher });

  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ================= LOGIN =================
const loginHandler = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ message: "Not found" });

    const match = await bcrypt.compare(password, teacher.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    res.json({ status: true, data: teacher });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= TEACHERS =================
const getAllTeachersHandler = async (req, res) => {
  const data = await Teacher.find();
  res.json(data);
};

// ================= COUNT =================
const getTeacherCount = async (req, res) => {
  const count = await Teacher.countDocuments();
  res.json({ totalTeachers: count });
};

// ================= SUBJECTS BY CLASS (FIXED) =================
const getSubjectsByClass = async (req, res) => {
  try {
    const className = req.params.className?.trim();
    const teacherName = req.query.teacherName?.trim();

    const timetable = await Timetable.findOne({ className });

    if (!timetable || !timetable.data) {
      return res.json([]);
    }

    const subjects = new Set();

    Object.values(timetable.data).forEach((item) => {
      if (!item || typeof item !== "object") return;
      if (item.subject && (!teacherName || item.teacher?.toLowerCase().trim() === teacherName.toLowerCase().trim())) {
        subjects.add(item.subject);
      }
    });

    res.json([...subjects]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ASSIGNMENT ADD (FIXED ROUTE SUPPORT) =================
const addAssignment = async (req, res) => {
  try {
    const { className, subject, text } = req.body;

    console.log("🔥 Adding assignment:", { className, subject, text });

    const assignment = await Assignment.create({
      className: className.trim(),
      subject: subject.trim(),
      text: text.trim(),
      date: new Date()
    });

    console.log("✅ Assignment created:", assignment);

    res.json({
      status: true,
      data: assignment,
    });

  } catch (err) {
    console.error("❌ Assignment error:", err);
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET /students/byClass/:className
const getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({
      studentClass: req.params.className
    });

    res.json({
      status: true,
      data: students
    });

  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};

// POST /teachers/result/add
const addResult = async (req, res) => {
  try {
    const { results } = req.body;

    // 🔥 Validate ALL marks before saving
    for (let result of results) {
      const marksNum = Number(result.marks);
      
      // ✅ Validation: marks should be 0-100
      if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
        return res.json({
          status: false,
          message: `Invalid marks for ${result.name}. Marks must be between 0-100. Received: ${result.marks}`
        });
      }
    }

    // ✅ Update or insert (upsert) - replaces old marks
    for (let result of results) {
      await Result.findOneAndUpdate(
        {
          studentId: result.studentId,
          subject: result.subject,
          className: result.className
        },
        {
          studentId: result.studentId,
          name: result.name,
          className: result.className,
          subject: result.subject,
          marks: Number(result.marks)
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      status: true,
      message: "Results saved successfully"
    });

  } catch (err) {
    res.json({
      status: false,
      message: err.message
    });
  }
};

module.exports = {
  dashboardHandler,
  registerHandler,
  loginHandler,
  getAllTeachersHandler,
  getTeacherCount,
  getSubjectsByClass,
  addAssignment,
  
  addResult,
};