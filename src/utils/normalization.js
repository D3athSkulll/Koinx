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

const normalizeAsset = (
    asset = ""
) => {

    const normalized =
        assetMap[
            asset.toLowerCase()
        ];

    return (
        normalized ||
        asset.toUpperCase()
    );
};

const normalizeType = (
    type = ""
) => {

    const normalized =
        typeMap[
            type.toLowerCase()
        ];

    return (
        normalized ||
        type.toUpperCase()
    );
};

export{
    normalizeAsset,
    normalizeType,
}