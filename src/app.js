import express from "express";

import reconcileRoutes from "./routes/reconcileRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// app.get("/", (req, res) => {
//   res.send("KoinX Reconciliation API Running");
// });

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KoinX Reconciliation Engine API Running",
    description: "Backend API for ingesting, reconciling, and reporting crypto transactions.",
    procedure: "Test ingest and reconcile to get runId, then test Report and Download endpoints.",
    endpoints: {
      ingest: "POST /api/ingest",
      reconcile: "POST /api/reconcile",
      fullReport: "GET /api/report/:runId",
      summaryReport: "GET /api/report/:runId/summary",
      unmatchedTransactions: "GET /api/report/:runId/unmatched",
      downloadCSVReport: "GET /api/report/:runId/download",
    },

    testing: {
      downloadMethod: "Auto Download CSV report for download endopoint, through browser",
      recommendedTool: "Postman for other endpoints",
    },
  });
});


app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});

app.use("/api", reconcileRoutes);
app.use("/api", reportRoutes);

export default app;
