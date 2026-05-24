import fs from "fs";
import {Parser} from "json2csv";

const generateCsvReport = (reconciliationResults, runId)=>{
    //format results
    const formattedResults = reconciliationResults.map((result)=>({
        category: result.category,
        reason: result.reason,
        user_transaction_id: result.userTransaction?.txId || "",
        exchange_transaction_id: result.exchangeTransaction?.txId || "",
        user_asset: result.userTransaction?.asset || "",
        exchange_asset: result.exchangeTransaction?.asset || "",
        user_timestamp: result.userTransaction?.timestamp || "",
        exchange_timestamp: result.exchangeTransaction?.timestamp || "",
    })
);

//create parser, remove "" from stored csv fields, store at given location also enable dowbnload feature later on
const parser = new Parser({quote: "", escapedQuote: "",});
let csv = parser.parse(formattedResults);
csv = csv.replace(/"/g, "");
const filePath = `./src/reports/reconciliation-report-${runId}.csv`;
fs.writeFileSync(filePath, csv);
return filePath;
};

export default generateCsvReport;