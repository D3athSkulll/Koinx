import express from "express";

import {
  downloadCSVReport,
  getFullReport,
  getSummaryReport,
  getUnmatchedTransactions,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/report/:runId", getFullReport);

router.get("/report/:runId/summary", getSummaryReport);

router.get("/report/:runId/unmatched", getUnmatchedTransactions);

router.get("/report/:runId/download", downloadCSVReport);

export default router;
