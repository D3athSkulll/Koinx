import mongoose from "mongoose";

const reconciliationRunSchema = new mongoose.Schema(
  {
    runId: {
      type: String,
      required: true,
      unique: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    configUsed: {
      timestampToleranceSeconds: {
        type: Number,
        default: 300,
      },
      quantityTolerancePct: {
        type: Number,
        default: 0.01,
      },
    },
    summary: {
      matched: {
        type: Number,
        default: 0,
      },
      conflicting: {
        type: Number,
        default: 0,
      },
      userOnly: {
        type: Number,
        default: 0,
      },
      exchangeOnly: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

const ReconciliationRun = mongoose.model(
    "ReconciliationRun",
    reconciliationRunSchema
);

export default ReconciliationRun;