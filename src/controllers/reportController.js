import ReconciliationResult from "../models/reconciliationResult.js";
import ReconciliationRun from "../models/reconciliationRun.js";
import generateCsvReport from "../utils/generateCsvReport.js";

const getFullReport = async (req, res) => {
  try {
    const { runId } = req.params;
    const results = await ReconciliationResult.find({
      runId,
    });

    const reportPath = generateCsvReport(results, runId);
    return res.status(200).json({
      success: true,
      totalResults: results.length,
      results,
      reportPath: reportPath
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSummaryReport = async (req, res) => {
  try {
    const { runId } = req.params;
    const run = await ReconciliationRun.findOne({
      runId,
    });
    if (!run) {
      return res.status(404).json({
        success: false,
        message: "Reconciliation not found",
      });
    }
    return res.status(200).json({
      success: true,
      runId,
      summary: run.summary,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUnmatchedTransactions = async (req, res) => {
  try {
    const { runId } = req.params;
    const unmatchedResults = await ReconciliationResult.find({
      runId,
      category: {
        $in: ["USER_ONLY", "EXCHANGE_ONLY"],
      },
    });
    return res.status(200).json({
      success: true,
      totalUnmatched: unmatchedResults.length,
      unmatchedResults,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { getFullReport, getSummaryReport, getUnmatchedTransactions };
