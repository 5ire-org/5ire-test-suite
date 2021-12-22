// Import the API
require('dotenv').config();
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Console } = require('winston/lib/winston/transports');
const { fetchLogger: logger } = require('../utils/logger');
async function main() {
    // Here we don't pass the (optional) provider, connecting directly to the default
    // node/port, i.e. `ws://127.0.0.1:9944`. Await for the isReady promise to ensure
    // the API has connected to the node and completed the initialisation process
    //console("node:" + process.env.ws_node);
    provider = new WsProvider(process.env.ws_node);
    const api = await ApiPromise.create({ provider });
    let count = 0;
    let totalTransactions = 0;
    let MaxNoTxnsBlock = 0;
    let presentBlocknumber = 0;
    for (let i = presentBlocknumber; i > 1; i--) {
        const blockHash = await api.rpc.chain.getBlockHash(i);
        const signedBlock = await api.rpc.chain.getBlock(blockHash);
        let blockTxs = 0;
        signedBlock.block.extrinsics.forEach((ex, index) => {
            let event = ex.toHuman();
            if (event.isSigned) {
                blockTxs++
            }
        });
        logger.info(`Total blockTxs:${i}:` + blockTxs);
        if (MaxNoTxnsBlock < blockTxs) MaxNoTxnsBlock = blockTxs;
        totalTransactions = totalTransactions + blockTxs;
    }
    logger.info("Total transactions:" + totalTransactions);
    logger.info("Max transactions in block:" + MaxNoTxnsBlock);
}
main().catch(logger.error);