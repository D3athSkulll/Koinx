import fs from "fs";
import csv from "csv-parser";

import validateTransactionRow from "./validator";
import { normalizeAsset, normalizeType } from "./normalization";

const parseCSV = (
    filePath,
    source,
    runId
)=>{
    return new Promise((resolve, reject)=>{
        const transactions = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row)=>{
                const issues = validateTransactionRow(row);

                const transaction = {
                    runId,
                    source,
                    txId: row.transaction_id || null,
                    asset: row.asset || "",
                    normalizedAsset: normalizeAsset(row.asset),
                    type: row.type || "",
                    normalizedType: normalizeType(row.type),
                    quantity: Number(row.quantity),
                    timestamp: row.timestamp ? new Date(row.timestamp) : null,
                    priceUsd: Number(row.priceUsd),
                    fee: Number(row.fee),
                    note: row.note || "",
                    rawData: row,
                    issues,
                };

                transactions.push(transaction);
            })
            .on("end", ()=>{
                resolve(transactions);
            })
            .on("error",(err)=>{
                reject(err);
            });
    });
};

export default parseCSV;