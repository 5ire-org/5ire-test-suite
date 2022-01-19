// Import the API
require('dotenv').config();
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { listnerLogger: logger } = require('../utils/logger');
async function main() {
    // Here we don't pass the (optional) provider, connecting directly to the default
    // node/port, i.e. `ws://127.0.0.1:9944`. Await for the isReady promise to ensure
    // the API has connected to the node and completed the initialisation process
    //console("node:" + process.env.ws_node);
    provider = new WsProvider(process.env.ws_node);
    const api = await ApiPromise.create({ provider });
    let count = 0;
    let blockCounts = 0;
    let totalTransactions = 0;
    // Subscribe to the new headers on-chain. The callback is fired when new headers
    // are found, the call itself returns a promise with a subscription that can be
    // used to unsubscribe from the newHead subscription

    const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(async (header) => {
        logger.info(`Chain is at finalized block: #${header.number}`);

        const blockHash = await api.rpc.chain.getBlockHash(header.number);
        const signedBlock = await api.rpc.chain.getBlock(blockHash);
        let txnCounter = 0;

        signedBlock.block.extrinsics.forEach((ex, index) => {
            let event = ex.toHuman();
            //logger.info(JSON.stringify(event));
            if (event.isSigned) {
                //logger.info(`${JSON.stringify(event.signer.Id)} ==> ${JSON.stringify(event.method.args.dest.Id)}`);
                txnCounter++;
                totalTransactions++
            }
            //if (event.method.method == 'transfer') txnCounter++
        });
        if (txnCounter > 0) blockCounts++;
        logger.info(`${txnCounter} transactions finalized in block: #${header.number}`);
        logger.info(`Total transactions #${totalTransactions} in finalized blocks: #${blockCounts}, Average transactions: ${totalTransactions / blockCounts}`);
        if (++count === 256) {
            logger.info("Counter > 256.. Exiting...");
            unsubscribe();
            process.exit(0);
        }
    });
}
main().catch(logger.error);