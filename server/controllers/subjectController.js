import Subject from "../models/Subject.js";
import AttendanceLog from "../models/AttendanceLog.js";
import { computeSubjectStats, computeOverallStats } from "../utils/bunkEngine.js";

// @route  GET /api/subjects
// Returns every subject for the user, each pre-annotated with live stats.
export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ user: req.user._id, archived: false }).sort({
      createdAt: 1,
    });

    const logs = await AttendanceLog.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: { subject: "$subject", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = {}; // subjectId -> { present, absent }
    for (const l of logs) {
      const sid = l._id.subject.toString();
      if (!countMap[sid]) countMap[sid] = { present: 0, absent: 0 };
      if (l._id.status === "present") countMap[sid].present = l.count;
      if (l._id.status === "absent") countMap[sid].absent = l.count;
    }

    const enriched = subjects.map((s) => {
      const c = countMap[s._id.toString()] || { present: 0, absent: 0 };
      const stats = computeSubjectStats(c.present, c.absent, s.targetPercentage);
      return { ...s.toObject(), stats };
    });

    const overall = computeOverallStats(
      enriched.map((s) => ({
        present: s.stats.present,
        absent: s.stats.absent,
        targetPercentage: s.targetPercentage,
      }))
    );

    res.json({ subjects: enriched, overall });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/subjects
export const createSubject = async (req, res, next) => {
  try {
    const { name, code, targetPercentage, color, icon } = req.body;
    if (!name) return res.status(400).json({ message: "Subject name is required" });

    const subject = await Subject.create({
      user: req.user._id,
      name,
      code,
      targetPercentage: targetPercentage ?? req.user.defaultTarget ?? 75,
      color,
      icon,
    });

    res.status(201).json({ subject });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/subjects/:id
export const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const { name, code, targetPercentage, color, icon, archived } = req.body;
    if (name !== undefined) subject.name = name;
    if (code !== undefined) subject.code = code;
    if (targetPercentage !== undefined) subject.targetPercentage = targetPercentage;
    if (color !== undefined) subject.color = color;
    if (icon !== undefined) subject.icon = icon;
    if (archived !== undefined) subject.archived = archived;

    await subject.save();
    res.json({ subject });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/subjects/:id
export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    await AttendanceLog.deleteMany({ subject: subject._id, user: req.user._id });
    res.json({ message: "Subject and its attendance history were deleted" });
  } catch (error) {
    next(error);
  }
};
