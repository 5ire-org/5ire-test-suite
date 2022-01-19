// Import the API
const { ApiPromise } = require('@polkadot/api');

async function main() {
    // Here we don't pass the (optional) provider, connecting directly to the default
    // node/port, i.e. `ws://127.0.0.1:9944`. Await for the isReady promise to ensure
    // the API has connected to the node and completed the initialisation process
    const api = await ApiPromise.create();
    let count = 0;
    // no blockHash is specified, so we retrieve the latest
    const blockHash = await api.rpc.chain.getBlockHash(42648);
    const signedBlock = await api.rpc.chain.getBlock(blockHash);
    // We only display a couple, then unsubscribe
    // the information for each of the contained extrinsics
    signedBlock.block.extrinsics.forEach((ex, index) => {
        // the extrinsics are decoded by the API, human-like view
        let event = ex.toHuman();
        console.log(event.method.method);
    });
}
main().catch(console.error);


