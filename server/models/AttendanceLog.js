import mongoose from "mongoose";

const attendanceLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    date: {
      // Stored as YYYY-MM-DD string for simple, timezone-safe querying
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    status: {
      type: String,
      enum: ["present", "absent", "cancelled"],
      required: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
  },
  { timestamps: true }
);

// One log per subject per day
attendanceLogSchema.index({ user: 1, subject: 1, date: 1 }, { unique: true });

export default mongoose.model("AttendanceLog", attendanceLogSchema);
