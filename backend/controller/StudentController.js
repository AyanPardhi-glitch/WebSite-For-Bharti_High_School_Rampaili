const Student = require("../models/Student");
const Timetable = require("../models/Timetable");
const Assignment = require("../models/Assigment");
const Result = require("../models/Result");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔥 Auto Student ID
const generateStudentId = async () => {
  const lastStudent = await Student.findOne().sort({ createdAt: -1 });

  if (!lastStudent) return "STD00001";

  const lastNumber = parseInt(lastStudent.studentId.replace("STD", ""));
  return `STD${String(lastNumber + 1).padStart(5, "0")}`;
};

// ✅ REGISTER
const registerHandler = async (req, res) => {
  try {
    const { password, email } = req.body;

    const exist = await Student.findOne({ email });
    if (exist) {
      return res.status(400).json({
        status: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const studentId = await generateStudentId();

    const student = await Student.create({
      ...req.body,
      password: hashedPassword,
      studentId,
    });

    res.status(201).json({
      status: true,
      studentId,
      student,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ✅ LOGIN
const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: student._id }, "secretkey", {
      expiresIn: "1d",
    });

    res.json({
      status: true,
      token,
      student,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ✅ GET STUDENT BY ID (SAFE)
const getStudentById = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ID",
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    res.json(student);

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// 🔥🔥 MAIN LOGIC (CLASS MATCH FIX)
const getStudentSubjects = async (req, res) => {
  try {
    // ✅ ObjectId check
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    // 🔥 FIX: "5th" -> "Class 5th"
    const className = `Class ${student.studentClass}`;

    const timetable = await Timetable.findOne({
      className: className,
    });

    if (!timetable || !timetable.data) {
      return res.json([]);
    }

    const subjectsSet = new Set();

    Object.values(timetable.data).forEach((item) => {
      if (item && item.subject) {
        subjectsSet.add(item.subject);
      }
    });

    // 🔥 FETCH ACTUAL MARKS FROM RESULT COLLECTION
    const marks = await Result.find({ studentId: student.studentId });
    const marksMap = {};
    
    marks.forEach((mark) => {
      marksMap[mark.subject] = mark.marks;
    });

    const subjects = [...subjectsSet].map((sub) => ({
      name: sub,
      marks: marksMap[sub] || 0,  // ✅ Now fetches real marks from DB
    }));

    res.json(subjects);

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// OTHER
const getAllStudentsHandler = async (req, res) => {
  const students = await Student.find();
  res.json({ status: true, students });
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getStudentsByClass = async (req, res) => {
  try {
    const rawClassName = (req.params.className || "").trim();
    const normalizedClassName = rawClassName.replace(/^class\s*/i, "").trim();

    const students = await Student.find({
      $or: [
        { studentClass: rawClassName },
        { studentClass: normalizedClassName },
        {
          studentClass: {
            $regex: new RegExp(`^${escapeRegExp(normalizedClassName)}$`, "i"),
          },
        },
      ],
    });

    res.json({ status: true, students });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

const addStudent = async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json({ status: true, student });
};

const dashboardHandler = async (req, res) => {
  const students = await Student.find();
  const classCount = {};

  students.forEach((s) => {
    classCount[s.studentClass] =
      (classCount[s.studentClass] || 0) + 1;
  });

  res.json({
    status: true,
    totalStudents: students.length,
    classCount,
  });
};



// ✅ GET ASSIGNMENT BY CLASS
const getAssignmentsByClass = async (req, res) => {
  try {
    const className = req.params.className.trim();

    console.log(`🔥 Fetching assignments for class: "${className}"`);

    const data = await Assignment.find({ className: className }).sort({ date: -1 });

    console.log(`✅ Found ${data.length} assignments for ${className}:`, data);

    res.json({
      status: true,
      data,
    });
  } catch (err) {
    console.error("❌ Error fetching assignments:", err);
    res.status(500).json({ status: false, message: err.message });
  }
};

// controller/StudentController.js

const getAllClasses = async (req, res) => {
  try {
    const classes = await Student.distinct("studentClass");

    res.json({
      status: true,
      data: classes,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// GET /students/byClass/:className



module.exports = {
  registerHandler,
  loginHandler,
  getAllStudentsHandler,
  getStudentsByClass,
  addStudent,
  dashboardHandler,
  getStudentSubjects,
  getStudentById,
  
  getAssignmentsByClass,
  getAllClasses,
};

