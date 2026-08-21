import AttendanceLog from "../models/AttendanceLog.js";
import Subject from "../models/Subject.js";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// @route  GET /api/attendance/day/:date  (YYYY-MM-DD)
export const getDayLog = async (req, res, next) => {
  try {
    const { date } = req.params;
    if (!DATE_RE.test(date)) return res.status(400).json({ message: "Invalid date format" });

    const logs = await AttendanceLog.find({ user: req.user._id, date });
    res.json({ date, logs });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/attendance/mark
// body: { subjectId, date, status, note }  -- upserts (one log per subject/day)
export const markAttendance = async (req, res, next) => {
  try {
    const { subjectId, date, status, note } = req.body;

    if (!subjectId || !date || !status) {
      return res.status(400).json({ message: "subjectId, date and status are required" });
    }
    if (!DATE_RE.test(date)) {
      return res.status(400).json({ message: "Invalid date format, expected YYYY-MM-DD" });
    }
    if (!["present", "absent", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Status must be present, absent or cancelled" });
    }

    const subject = await Subject.findOne({ _id: subjectId, user: req.user._id });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const log = await AttendanceLog.findOneAndUpdate(
      { user: req.user._id, subject: subjectId, date },
      { status, note: note || "" },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ log });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/attendance/:id
export const deleteLog = async (req, res, next) => {
  try {
    const log = await AttendanceLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ message: "Log entry not found" });
    res.json({ message: "Entry cleared" });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/attendance/range?start=YYYY-MM-DD&end=YYYY-MM-DD
// Used for the calendar / history view
export const getRange = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end || !DATE_RE.test(start) || !DATE_RE.test(end)) {
      return res.status(400).json({ message: "start and end query params (YYYY-MM-DD) are required" });
    }

    const logs = await AttendanceLog.find({
      user: req.user._id,
      date: { $gte: start, $lte: end },
    })
      .populate("subject", "name color code")
      .sort({ date: 1 });

    res.json({ logs });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/attendance/export?format=json|csv
export const exportData = async (req, res, next) => {
  try {
    const format = (req.query.format || "json").toLowerCase();
    const logs = await AttendanceLog.find({ user: req.user._id })
      .populate("subject", "name code targetPercentage")
      .sort({ date: 1 });

    if (format === "csv") {
      const header = "Date,Subject,Code,Status,Note\n";
      const rows = logs
        .map((l) => {
          const subj = l.subject || {};
          const escape = (v = "") => `"${String(v).replace(/"/g, '""')}"`;
          return [l.date, escape(subj.name), escape(subj.code), l.status, escape(l.note)].join(",");
        })
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=careclass-attendance.csv");
      return res.send(header + rows);
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=careclass-attendance.json");
    res.json({ exportedAt: new Date().toISOString(), logs });
  } catch (error) {
    next(error);
  }
};
