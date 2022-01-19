var assert = require('chai').assert;
const { ApiPromise, WsProvider, Keyring } = require('@5ire/api');
var BigNumber = require('big-number');
const { randomAsU8a } = require('@polkadot/util-crypto');
require('dotenv').config();

describe('@5ire/api', async () => {
    beforeEach(async () => {
        provider = new WsProvider('wss://ryuk.testnet.5ire.network/ws');
        // provider = new WsProvider('ws://127.0.0.1:9944')
        api = await ApiPromise.create({ provider });
    });


    it('should connect to provider', async () => {
        const chain = await api.rpc.system.chain();
        console.log(`Connected to ${chain} !`);    //5ire Test Net
        assert.equal(chain, "5ire Test Net");
    });

    it('should check constants on chain', async () => {
        const existentialDeposit = await api.consts.balances.existentialDeposit.toNumber();  //constants of chain
        console.log("existentialDeposit: " + existentialDeposit);
        assert.equal(existentialDeposit, 500)
    });

    it('should check EVM balances on chain', async () => {
        adr = process.env.ADR;
        console.log(adr);
        const bal = (await api.rpc.eth.getBalance(adr)).toString();
        console.log("balance of "+ adr+": "+ bal);
        assert.isTrue(BigNumber(bal).gt(0), "bal should be greater than 0")
    });

    it('should check native balances on chain', async () => {
        adr32 = process.env.ADR32;
        const bal = (await api.query.system.account(adr32));
        console.log("balance of " + adr32 + ": " + bal.data.free);
        assert.isTrue(BigNumber(bal.data.free).gt(0), "bal should be greater than 0")
    });

    it('should check blocks being generated', done => {
        count = 0;
        setTimeout(async () => {
            await api.rpc.chain.subscribeNewHeads((header) => {
                console.log(`Chain is at block: #${header.number}`);
                if (++count === 3) {
                    done();
                }
            });
        }, 30);
    });

    it('should be able to sign and send txn', done => {
        setTimeout(async () => {
            const keyring = new Keyring({ type: 'sr25519' });
            const mnemonic = process.env.MNEMONIC;
            // const user = keyring.createFromUri("//Alice");
            const user = keyring.createFromUri(mnemonic);
            AMOUNT = 1000
            const { nonce } = await api.query.system.account(process.env.ADR_TXN);
            const recipient = keyring.addFromSeed(randomAsU8a(32)).address;
            const bal = (await api.query.system.account(user.address)).toString();
            console.log(bal);
            console.log('Sending', AMOUNT, 'from', user.address, 'to', recipient, 'with nonce', nonce.toString());
            api.tx.balances
                .transfer(recipient, AMOUNT)
                .signAndSend(user, { nonce }, ({ events = [], status }) => {
                    console.log('Transaction status:', status.type);

                    if (status.isInBlock) {
                        console.log('Included at block hash', status.asInBlock.toHex());
                        console.log('Events:');

                        events.forEach(({ event: { data, method, section }, phase }) => {
                            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                        });
                    } else if (status.isFinalized) {
                        console.log('Finalized block hash', status.asFinalized.toHex());
                        done();
                    }
                });
        }, 10)
    });


});
