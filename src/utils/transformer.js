import {
    normalizeAsset,
    normalizeType
} from "./normalization.js";

const transformTransaction = (
    row,
    source,
    runId,
    issues
)=>{
    const parsedQuantity = Number(row.quantity);
    const parsedPriceUsd = Number(row.price_usd);
    const parsedFee = Number(row.fee);
    const parsedTimestamp = new Date(row.timestamp);

    return{
        runId,
        source,
        txId: row.transaction_id || null,
        asset: row.asset || "",
        normalizedAsset: normalizeAsset(row.asset) || "UNKNOWN",
        type: row.type || "",
        normalizedType: normalizeType(row.type) || "UNKNOWN",
        quantity: isNaN(parsedQuantity) ? 0 : parsedQuantity,
        timestamp: isNaN(parsedTimestamp.getTime()) ? null : parsedTimestamp,
        priceUsd: isNaN(parsedPriceUsd)? 0 : parsedPriceUsd,
        fee: isNaN(parsedFee)? 0 : parsedFee,
        note: row.note || "",
        rawData: row,
        issues
    };
};

export default transformTransaction;