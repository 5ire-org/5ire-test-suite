const { mnemonicGenerate } = require('@polkadot/util-crypto');
const { Keyring } = require('@polkadot/keyring');
const BN = require('bn.js');
const keyring = new Keyring({ type: 'sr25519' });
// Creates test account.
function createAccount(mnemonic) {
    mnemonic = mnemonic && mnemonicValidate(mnemonic)
        ? mnemonic
        : mnemonicGenerate();
    const account = keyring.addFromMnemonic(mnemonic);
    return { account, mnemonic };
}

// Build Initial transfer amount
const decims = new BN(api.registry.chainDecimals);
const factor = new BN(10).pow(decims);
const initialTransferAmount = new BN(1500).mul(factor);

// Build Normal transfer amount
const normalDecims = new BN(api.registry.chainDecimals);
const normalFactor = new BN(10).pow(normalDecims);
const normalTransferAmount = new BN(1).mul(normalFactor);

// export {
//     //createAccount
//     // initialTransferAmount,
//     // normalTransferAmount
// }