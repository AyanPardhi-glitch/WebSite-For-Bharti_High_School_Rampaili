const Attendance = require("../models/Attendance");

// ===============================
// 📌 SAVE / UPDATE ATTENDANCE
// ===============================
exports.saveAttendance = async (req, res) => {
  try {
    const { className, attendance, date } = req.body;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);

    let record = await Attendance.findOne({
      className,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    // 🔥 UPDATE CASE
    if (record) {
      const timeDiff =
        Date.now() - new Date(record.createdAt).getTime();

      if (timeDiff > 24 * 60 * 60 * 1000) {
        return res.json({
          status: false,
          message: "❌ Cannot update after 24 hours",
        });
      }

      record.records = attendance;
      await record.save();

      return res.json({
        status: true,
        message: "✅ Attendance Updated",
      });
    }

    // 🔥 CREATE CASE
    await Attendance.create({
      className,
      date,
      records: attendance,
    });

    return res.json({
      status: true,
      message: "✅ Attendance Saved",
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};

// ===============================
// 📌 GET ATTENDANCE (CLASS + DATE)
// ===============================
exports.getAttendance = async (req, res) => {
  try {
    const { className, date } = req.query;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);

    const record = await Attendance.findOne({
      className,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    return res.json({
      status: true,
      records: record ? record.records : {},
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ===============================
// 📊 CLASS WISE SUMMARY
// ===============================
exports.getAllClassesAttendance = async (req, res) => {
  const data = await Attendance.find();

  const result = {};

  data.forEach((item) => {
    if (!result[item.className]) {
      result[item.className] = {
        present: 0,
        absent: 0,
        total: 0,
      };
    }

    Object.values(item.records).forEach((status) => {
      if (status === "Present") result[item.className].present++;
      else result[item.className].absent++;
    });

    result[item.className].total += Object.keys(item.records).length;
  });

  const final = Object.keys(result).map((cls) => ({
    className: cls,
    ...result[cls],
  }));

  res.json(final);
};
// ===============================
// 🔥 STUDENT DASHBOARD ATTENDANCE (FINAL LOGIC)
// ===============================
// ===============================
// 🔥 STUDENT DASHBOARD ATTENDANCE
// ===============================
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId.toString();

    const records = await Attendance.find({
      [`records.${studentId}`]: { $exists: true }
    });

    let total = 0;
    let present = 0;

    const monthly = {};

    records.forEach((rec) => {
      const status = rec.records?.[studentId];

      if (status) {
        total++;

        const normalized = status.toLowerCase();

        if (normalized === "present") present++;

        const month = new Date(rec.date).toLocaleString("default", {
          month: "short",
        });

        if (!monthly[month]) {
          monthly[month] = { present: 0, total: 0 };
        }

        monthly[month].total++;

        if (normalized === "present") {
          monthly[month].present++;
        }
      }
    });

    const percentage = total
      ? Math.round((present / total) * 100)
      : 0;

    res.json({
      percentage,
      present,
      absent: total - present,
      total,
      monthly: Object.keys(monthly).map((m) => ({
        month: m,
        present: monthly[m].present,
        total: monthly[m].total,
      })),
    });

  } catch (err) {
    console.log("Student Attendance Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ===============================
// 📌 STUDENT HISTORY
// ===============================
exports.getAttendanceByStudentId = async (req, res) => {
  try {
    const studentId = req.params.studentId.toString();

    const records = await Attendance.find({
      [`records.${studentId}`]: { $exists: true }
    });

    const data = records.map((rec) => ({
      date: rec.date,
      status: rec.records[studentId],
      className: rec.className,
    }));

    res.json({ data });

  } catch (err) {
    console.log("History Error:", err);
    res.status(500).json({ message: err.message });
  }
};