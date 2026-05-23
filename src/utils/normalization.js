const assetMap = {
    btc: "BTC",
    bitcoin: "BTC",

    eth: "ETH",
    ethereum: "ETH",
};

const typeMap = {
    transfer_in: "TRANSFER",
    transfer_out: "TRANSFER",

    buy: "BUY",
    sell: "SELL",
};

const normalizeAsset = (asset = "")=>{
    return(
        assetMap[asset.toLowerCase()]
    );
};

const normalizeType = (type = "")=>{
    return(
        typeMap[type.toLowerCase()]
    );
};

export{
    normalizeAsset,
    normalizeType,
}