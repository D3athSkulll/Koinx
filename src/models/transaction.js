import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    runId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ["USER", "EXCHANGE"],
      required: true,
    },
    txId: {
      type: String,
      default: null,
    },
    asset: {
      type: String,
      required: true,
    },
    normalizedAsset: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    rawData: {
      type: Object,
      required: true,
    },
    issues: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model(
    "Transaction",
    transactionSchema
);

export default Transaction;
