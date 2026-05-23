import {v4 as uuidv4} from "uuid";

import Transaction from "../models/transaction.js";
import ReconciliationRun from "../models/reconciliationRun.js";
import ReconciliationResult from "../models/reconciliationResult.js";

import parseCSV from "../utils/csvParser.js";
import reconcileTransactions from "../utils/matchingEngine.js";

const ingestTransactions = async(req, res)=>{
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

const reconcileController = async(req,res)=>{
    try {
        const runId = uuidv4();
        await ReconciliationRun.create({
            runId,
        });

        const userFilePath = "./src/data/user_transactions.csv";
        const exchangeFilePath = "./src/data/exchange_transactions.csv";

        const userTransactions = await parseCSV( userFilePath, "USER", runId );
        const exchangeTransactions = await parseCSV( exchangeFilePath, "EXCHANGE", runId );

        const storedUserTransactions = await Transaction.insertMany( userTransactions );
        const storedExchangeTransactions = await Transaction.insertMany( exchangeTransactions );

        const validUserTransactions = storedUserTransactions.filter(
            (tx) => tx.issues.length===0
        );
        const validExchangeTransactions = storedExchangeTransactions.filter(
            (tx) => tx.issues.length===0
        );

        const matchedResults = reconcileTransactions(
            validUserTransactions,
            validExchangeTransactions
        );

        const reconciliationResults = matchedResults.map((res)=>({
            ...res,
            runId,
        })
        );

        await ReconciliationResult.insertMany(
            reconciliationResults
        );
        
        const summary = {
            matched: reconciliationResults.filter(
                (res) => res.category === "MATCHED"
            ).length,

            conflicting: reconciliationResults.filter(
                (res) => res.category === "CONFLICTING"
            ).length,

            user_only: reconciliationResults.filter(
                (res) => res.category === "USER_ONLY" 
            ).length,

            exchange_only: reconciliationResults.filter(
                (res) => res.category === "EXCHANGE_ONLY"
            ).length
        };
        
        await ReconciliationRun.findOneAndUpdate(
            {
                runId
            },
            {
                completedAt: new Date(),
                summary,
            }
        )
        return res.status(200).json({
            success: true,
            message: "Reconciliation completed successfully",
            runId,
            summary,
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export {reconcileController, ingestTransactions};