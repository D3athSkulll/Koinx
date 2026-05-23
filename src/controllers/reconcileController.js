import {v4 as uuidv4} from "uuid";

import Transaction from "../models/transaction.js";
import ReconciliationRun from "../models/reconciliationRun.js";

import parseCSV from "../utils/csvParser.js";

const reconcileTransactions = async(req, res)=>{
    try {
        const userFilePath = "./src/data/user_transactions.csv";
        const exchangeFilePath = "./src/data/exchange_transactions.csv";

        const runId = uuidv4();
        await ReconciliationRun.create({
            runId,
        });

        const userTransactions = await parseCSV(
            userFilePath,
            "USER",
            runId
        );

        const exchangeTransactions = await parseCSV(
            exchangeFilePath,
            "EXCHANGE",
            runId
        );

        const allTransactions = [
            ...userTransactions,
            ...exchangeTransactions,
        ];

        await Transaction.insertMany(
            allTransactions
        );

        const invalidTransactions = allTransactions.filter((tx)=>{
            return tx.issues.length > 0;
        });

        return res.status(200).json({
            success: true,
            message: "Transactions ingested successfully",
            runId,
            summary: {
                totalTransactions: allTransactions.length,
                userTransactions: userTransactions.length,
                exchangeTransactions: exchangeTransactions.length,
                invalidTransactions: invalidTransactions.length,
            },
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export {reconcileTransactions};