const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const timetableSocket = require("./socket/timetableSocket");
const resultRoutes = require("./routes/resultRoutes")
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
mongoose.connect("mongodb://127.0.0.1:27017/schoolDB")
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log(err));

// ✅ SOCKET INIT
timetableSocket(io);

// routes
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/results", resultRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});