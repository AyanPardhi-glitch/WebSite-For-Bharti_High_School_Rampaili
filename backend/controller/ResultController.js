const Result = require("../models/Result");
const FinalResult = require("../models/FinalResult");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const json2xls = require("json2xls");
const { Document, Packer, Paragraph, TextRun } = require("docx");

// ✅ Add Subject Marks
exports.addMarks = async (req, res) => {
  try {
    const newMark = new Result(req.body);
    await newMark.save();

    res.json({ success: true, message: "Marks Added" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GENERATE SINGLE STUDENT RESULT
exports.generateResult = async (req, res) => {
  try {
    const { studentId } = req.body;

    const marksData = await Result.find({ studentId });

    if (!marksData.length) {
      return res.status(404).json({
        success: false,
        message: "No marks found"
      });
    }

    let totalObtained = 0;
    let totalMarks = 0;

    const subjects = marksData.map((item) => {
      totalObtained += item.marks;
      totalMarks += 100;

      return {
        subject: item.subject,
        marks: item.marks,
        totalMarks: 100
      };
    });

    const percentage = Number(
      ((totalObtained / totalMarks) * 100).toFixed(2)
    );

    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 75) grade = "A";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";

    const existing = await FinalResult.findOne({ studentId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Result already generated"
      });
    }

    const final = await FinalResult.create({
      studentId,
      name: marksData[0].name,
      className: marksData[0].studentClass, // ✅ FIX
      subjects,
      totalObtained,
      totalMarks,
      percentage,
      grade
    });

    res.json({
      success: true,
      message: "Result generated",
      data: final
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GENERATE CLASS RESULT
exports.generateClassResult = async (req, res) => {
  try {
    const { className } = req.body;

    const marksData = await Result.find({ className: className });

    if (!marksData.length) {
      return res.json({ success: false, message: "No data found" });
    }

    const map = {};

    marksData.forEach((item) => {
      if (!map[item.studentId]) {
        map[item.studentId] = {
          studentId: item.studentId,
          name: item.name,
          className: item.studentClass,
          subjects: [],
          totalObtained: 0,
          totalMarks: 0
        };
      }

      map[item.studentId].subjects.push({
        subject: item.subject,
        marks: item.marks,
        totalMarks: 100
      });

      map[item.studentId].totalObtained += item.marks;
      map[item.studentId].totalMarks += 100;
    });

    const results = [];

    for (let key in map) {
      const s = map[key];

      const percentage = (s.totalObtained / s.totalMarks) * 100;

      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 75) grade = "A";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 50) grade = "C";

      const exist = await FinalResult.findOne({ studentId: s.studentId });
      if (exist) continue;

      const final = await FinalResult.create({
        ...s,
        percentage,
        grade
      });

      results.push(final);
    }

    res.json({
      success: true,
      message: "Class result generated",
      data: results
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET SINGLE RESULT
exports.getFinalResult = async (req, res) => {
  try {
    const data = await FinalResult.findOne({
      studentId: req.params.studentId
    });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getClassResult = async (req, res) => {
  try {
    const { className } = req.params;

    // 🔥 USE MONGODB AGGREGATION TO PREVENT DUPLICATES
    const data = await Result.aggregate([
      // Match class
      { $match: { className: className } },
      
      // 🔥 Group by studentId + subject to get only latest entry
      {
        $group: {
          _id: { studentId: "$studentId", subject: "$subject" },
          marks: { $last: "$marks" },
          studentId: { $first: "$studentId" },
          name: { $first: "$name" },
          subject: { $first: "$subject" },
          date: { $max: "$date" }
        }
      },
      
      // Sort by date to ensure latest entries
      { $sort: { date: -1 } }
    ]);

    if (!data.length) {
      return res.json({ success: true, data: [] });
    }

    // 🔥 CONSOLIDATE BY STUDENT
    const map = {};

    data.forEach(item => {
      if (!map[item.studentId]) {
        map[item.studentId] = {
          studentId: item.studentId,
          name: item.name,
          subjects: [],
          totalObtained: 0
        };
      }

      // Add subject only once (aggregation ensures this)
      if (item.marks && !isNaN(item.marks) && item.marks >= 0) {
        map[item.studentId].subjects.push({
          subject: item.subject,
          marks: item.marks,
          totalMarks: 100
        });

        map[item.studentId].totalObtained += item.marks;
      }
    });

    const final = Object.values(map).map(stu => {
      const totalMarks = stu.subjects.length * 100;
      const percentage = totalMarks > 0 ? (stu.totalObtained / totalMarks) * 100 : 0;

      return {
        ...stu,
        totalMarks,
        percentage: Number(percentage.toFixed(2))
      };
    });

    res.json({ success: true, data: final });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.downloadResult = async (req, res) => {
  try {
    const { studentId, type } = req.params;

    const data = await FinalResult.findOne({ studentId });

    if (!data) {
      return res.status(404).json({ message: "No result found" });
    }

    const fileName = `marksheet_${studentId}`;

    // ==========================
    // 📄 PDF DOWNLOAD
    // ==========================
    if (type === "pdf") {
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}.pdf`
      );

      doc.pipe(res);

      doc.fontSize(20).text("STUDENT MARKSHEET", { align: "center" });
      doc.moveDown();

      doc.fontSize(14).text(`Name: ${data.name}`);
      doc.text(`Class: ${data.className}`);
      doc.text(`Student ID: ${data.studentId}`);
      doc.moveDown();

      data.subjects.forEach((sub) => {
        doc.text(`${sub.subject}: ${sub.marks}/${sub.totalMarks}`);
      });

      doc.moveDown();
      doc.text(`Total: ${data.totalObtained}`);
      doc.text(`Percentage: ${data.percentage}%`);
      doc.text(`Grade: ${data.grade}`);

      doc.end();
    }

    // ==========================
    // 📊 EXCEL DOWNLOAD
    // ==========================
    else if (type === "excel") {
      const excelData = [
        {
          Name: data.name,
          Class: data.className,
          StudentID: data.studentId,
          Total: data.totalObtained,
          Percentage: data.percentage,
          Grade: data.grade,
        },
      ];

      const xls = json2xls(excelData);

      res.setHeader("Content-Type", "application/vnd.openxmlformats");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}.xlsx`
      );

      res.end(xls, "binary");
    }

    // ==========================
    // 📝 WORD DOWNLOAD
    // ==========================
    else if (type === "word") {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "STUDENT MARKSHEET",
                    bold: true,
                    size: 32,
                  }),
                ],
              }),

              new Paragraph(`Name: ${data.name}`),
              new Paragraph(`Class: ${data.className}`),
              new Paragraph(`Student ID: ${data.studentId}`),

              new Paragraph(""),

              ...data.subjects.map(
                (s) =>
                  new Paragraph(`${s.subject}: ${s.marks}/${s.totalMarks}`)
              ),

              new Paragraph(""),
              new Paragraph(`Total: ${data.totalObtained}`),
              new Paragraph(`Percentage: ${data.percentage}%`),
              new Paragraph(`Grade: ${data.grade}`),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}.docx`
      );
      res.send(buffer);
    } else {
      res.status(400).json({ message: "Invalid type" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};