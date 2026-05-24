const validateTransactionRow = (row)=>{
    const issues = [];

    if(!row.asset){
        issues.push("MISSING_ASSET");
    }

    if(!row.transaction_id){
        issues.push("MISSING_TRANSACTION_ID");
    }

    if(!row.type){
        issues.push("MISSING_TYPE");
    }

    if(row.quantity === undefined || row.quantity === null || isNaN(Number(row.quantity)) || Number(row.quantity) <= 0){
        issues.push("INVALID_QUANTITY");
    }

    //only trades require price
    const normalizedType = row.type?.trim().toUpperCase();
    const requiresPrice = normalizedType === "BUY" || normalizedType === "SELL";
    
    if(requiresPrice && (!row.price_usd || isNaN(Number(row.price_usd)))){
        issues.push("INVALID_PRICE_USD");
    }

    if(!row.timestamp || isNaN( new Date(row.timestamp).getTime())){
        issues.push("INVALID_TIMESTAMP");
    }

    return issues;
};

export default validateTransactionRow;