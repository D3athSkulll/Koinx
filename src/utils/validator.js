const validateTransactionRow = (row)=>{
    const issues = [];

    if(!row.asset){
        issues.push("MISSING_ASSET");
    }

    if(!row.type){
        issues.push("MISSING_TYPE");
    }

    if(!row.quantity || isNAN(Number(row.quantity))){
        issues.push("INVALID_QUANTITY");
    }

    if(!row.timestamp || isNAN( new Date(row.timestamp).getTime())){
        issues.push("INVALID_TIMESTAMP");
    }

    return issues;
};

export default validateTransactionRow;