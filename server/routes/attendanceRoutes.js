import express from "express";
import {
  getDayLog,
  markAttendance,
  deleteLog,
  getRange,
  exportData,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/day/:date", getDayLog);
router.post("/mark", markAttendance);
router.delete("/:id", deleteLog);
router.get("/range", getRange);
router.get("/export", exportData);

export default router;
