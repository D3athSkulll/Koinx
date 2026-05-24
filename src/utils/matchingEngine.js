import {
  TIMESTAMP_TOLERANCE_SECONDS,
  QUANTITY_TOLERANCE_PCT,
} from "../constants.js";

// match TimeStamp and Quantity according to given tolerance values
const isTimestampMatch = (timestamp1, timestamp2) => {
  const diffInSeconds =
    Math.abs(new Date(timestamp1) - new Date(timestamp2)) / 1000;
  return diffInSeconds <= TIMESTAMP_TOLERANCE_SECONDS;
};

const isQuantityMatch = (quantity1, quantity2) => {
  const diff = Math.abs(quantity1 - quantity2);
  const percentDiff = (diff / quantity1) * 100;
  return percentDiff <= QUANTITY_TOLERANCE_PCT;
};

//handle order matching logic for user, exchange tx pairs
const reconcileTransactions = (userTransactions, exchangeTransactions) => {
  const results = [];
  const matchedExchangeTransactions = new Set();

  //process user transactions
  for (const userTx of userTransactions) {
    let matched = false;
    let conflictingCandidate = null;

    for (const exchangeTx of exchangeTransactions) {
      //skip if this exchange transaction is paired already.
      if (matchedExchangeTransactions.has(exchangeTx._id.toString())) {
        continue;
      }

      //Hard Asset and Type Checks
      const assetMatch = userTx.normalizedAsset === exchangeTx.normalizedAsset;
      const typeMatch = userTx.normalizedType === exchangeTx.normalizedType;

      if (!assetMatch || !typeMatch) {
        continue;
      }

      //Hard Timestamp checks
      const timestampMatch = isTimestampMatch(
        userTx.timestamp,
        exchangeTx.timestamp,
      );

      const quantityMatch = isQuantityMatch(
        userTx.quantity,
        exchangeTx.quantity,
      );

      //case 1: perfect match with tolerances
      if (timestampMatch && quantityMatch) {
        results.push({
          category: "MATCHED",
          reason: "Matched within tolerance",
          userTransaction: userTx,
          exchangeTransaction: exchangeTx,
        });

        matchedExchangeTransactions.add(exchangeTx._id.toString());
        matched = true;
        break;// move to next user transaction
      }
      //Case 2: partial match same type/asset but numbers dont match
      conflictingCandidate = exchangeTx;
    }

    if (!matched) {
      if (conflictingCandidate) {
        results.push({
          // partial match -> conflicting
          category: "CONFLICTING",
          reason: "Quantity or timestamp exceeds tolerance",
          userTransaction: userTx,
          exchangeTransaction: conflictingCandidate,
        });
        matchedExchangeTransactions.add(conflictingCandidate._id.toString());
      } else {
        results.push({
          //missing on exchange side
          category: "USER_ONLY",
          reason: "No matching exchange transaction found",
          userTransaction: userTx,
          exchangeTransaction: null,
        });
      }
    }
  }

  for (const exchangeTx of exchangeTransactions) {
    if (!matchedExchangeTransactions.has(exchangeTx._id.toString())) {
      results.push({
        //missing in user
        category: "EXCHANGE_ONLY",
        reason: "No matching user transaction found",
        userTransaction: null,
        exchangeTransaction: exchangeTx,
      });
    }
  }
  return results;
};
export { isTimestampMatch, isQuantityMatch };
export default reconcileTransactions;
