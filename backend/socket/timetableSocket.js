console.log("🔥 timetableSocket FILE LOADED");

const Timetable = require("../models/Timetable");

const timetableSocket = (io) => {

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // ✅ GET ALL TIMETABLES
    socket.on("get_all_timetables", async () => {
      try {
        const all = await Timetable.find();

        const formatted = {};

        all.forEach((item) => {
          formatted[item.className] = item.data;
        });

        socket.emit("load_all_timetables", formatted);

      } catch (err) {
        console.log(err.message);
      }
    });

    // ✅ UPDATE TIMETABLE (FIXED STRUCTURE)
    socket.on("update_timetable", async ({ className, data }) => {
      try {

        await Timetable.findOneAndUpdate(
          { className },
          { data },
          { upsert: true, new: true }
        );

        io.emit("update_timetable", {
          className,
          data
        });

      } catch (err) {
        console.log(err.message);
      }
    });

  });
};

module.exports = timetableSocket;