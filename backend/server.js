require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const timetableSocket = require("./socket/timetableSocket");
const resultRoutes = require("./routes/resultRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");


const app = express();
const server = http.createServer(app);

// socket
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// ✅ DB CONNECT
const DB_URL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/schoolDB";
mongoose.connect(DB_URL)
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log(err));

// ✅ SOCKET INIT
timetableSocket(io);

// routes
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/results", resultRoutes);

// Serve frontend build when deployed together
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});