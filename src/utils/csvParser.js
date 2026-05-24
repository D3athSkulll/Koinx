import fs from "fs";
import csv from "csv-parser";

import transformTransaction from "./transformer.js";
import validateTransactionRow from "./validator.js";

const parseCSV = (
    filePath,
    source,
    runId
)=>{
    return new Promise((resolve, reject)=>{
        const transactions = [];
        const seenTransactionIds= new Set();

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row)=>{
                const issues = validateTransactionRow(row);

                if(row.transaction_id){
                    if(seenTransactionIds.has(row.transaction_id)){
                        issues.push("DUPLICATE_TRANSACTION");
                    }else{
                        seenTransactionIds.add(row.transaction_id);
                    }
                }    
                const transaction = transformTransaction(
                    row,
                    source,
                    runId,
                    issues
                )

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