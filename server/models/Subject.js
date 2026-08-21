import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
      maxlength: 80,
    },
    code: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },
    targetPercentage: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
    },
    color: {
      type: String,
      default: "#E8B84B",
    },
    icon: {
      type: String,
      default: "book-open",
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

subjectSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Subject", subjectSchema);
