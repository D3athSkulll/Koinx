import mongoose from "mongoose";

const reconciliationResultSchema = new mongoose.Schema({
    runId: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: [
            "MATCHED",
            "CONFLICTING",
            "USER_ONLY",
            "EXCHANGE_ONLY"
        ],
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    userTransaction: {
        type: Object,
        default: null,
    },
    exchangeTransaction: {
        type: Object,
        default: null,
    },
},
{
    timestamps: true,
});

const ReconciliationResult = mongoose.model(
    "ReconciliationResult",
    reconciliationResultSchema
);

export default ReconciliationResult;