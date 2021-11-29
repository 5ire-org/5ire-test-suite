// Required imports
require('dotenv').config();
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
//const { createAccount, initialTransferAmount, normalTransferAmount } = require('./accounts')
const {
  mnemonicGenerate,
  mnemonicValidate
} = require('@polkadot/util-crypto');
const BN = require('bn.js');
const keyring = new Keyring({ type: 'sr25519' });
let provider, api, sudoAccount;
let spaceArr = new Map();
let airArr = new Map();
let fireArr = new Map();
let waterArr = new Map();
let earthArr = new Map();
let testAccountArr = [spaceArr, airArr, fireArr, waterArr, earthArr];
let normalTransferAmount;
async function createAccounts() {
  // Retrieve the chain & node information information via rpc calls
  // Initialise the provider to connect to the local node
  provider = new WsProvider('ws://127.0.0.1:9944');
  // Create the API and wait until ready
  api = await ApiPromise.create({ provider });
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);
  console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
  sudoAccount = createAccount('beef magnet pepper void pizza silk toilet gentle gold news nest stable');
  for (let i = 1; i < 11; i++) {
    spaceArr.set('sTestAccount' + i, createAccount());
    airArr.set('aTestAccount' + i, createAccount());
    fireArr.set('fTestAccount' + i, createAccount());
    waterArr.set('wTestAccount' + i, createAccount());
    earthArr.set('eTestAccount' + i, createAccount());
  }
}
async function main() {
  // Create test accounts
  await createAccounts();
  //const test1Account = createAccount();
  // Build Initial transfer amount
  const decims = new BN(api.registry.chainDecimals);
  const factor = new BN(10).pow(decims);
  const initialTransferAmount = new BN(15000).mul(factor);

  // Build Normal transfer amount
  const normalDecims = new BN(api.registry.chainDecimals);
  const normalFactor = new BN(10).pow(normalDecims);
  normalTransferAmount = new BN(1).mul(normalFactor);

  const balance = await api.derive.balances.all(sudoAccount.account.address);
  const available = balance.availableBalance;
  //console.log(`Sudo Balance: ${available}`);



  // Transfering initial amount to test accounts
  //testAccountArr.forEach(async (element) => {
  for (const element of testAccountArr) {
    for (let [key, value] of (element)) {

      const transfer = api.tx.balances.transfer(value.account.address, initialTransferAmount);
      const { partialFee } = await transfer.paymentInfo(value.account.address);
      const fees = partialFee.muln(110).divn(100);
      const total = initialTransferAmount.add(fees).add(api.consts.balances.existentialDeposit);
      if (total.gt(available)) {
        console.error(
          `Cannot transfer ${initialTransferAmount} with ${available} left to ${key}`
        );
      }
      else {
        const nonce = await api.rpc.system.accountNextIndex(sudoAccount.account.address);
        const tx = await transfer.signAndSend(sudoAccount.account, { nonce });
        console.log(`Transfered to ${key} - ${value.account.address} amount ${initialTransferAmount}; Transfer: ${tx}; `);

      }
    }
  }
  sleep(40000);
  await transferBetweenGrids();
  await transferBetweenGrids();
  await transferBetweenGrids();
  await transferBetweenGrids();
}

main().catch(console.error).finally(() => process.exit());

// Creates test account.
function createAccount(mnemonic) {
  mnemonic = mnemonic && mnemonicValidate(mnemonic)
    ? mnemonic
    : mnemonicGenerate();
  const account = keyring.addFromMnemonic(mnemonic);
  // console.log(`Addr: ${account.address}- ${mnemonic}`)
  return { account, mnemonic };
}

// Transfer between the Grids
async function transferBetweenGrids() {
  let source = new Map();
  source.set('sudoAccount', sudoAccount);
  for (const target of testAccountArr) {
    for (let [sourceKey, SourceAccount] of (source)) {
      //console.log(SourceAccount.account.address)
      for (let [targetKey, targetAccount] of (target)) {
        //console.log(targetAccount.account.address);
        const balance = await api.derive.balances.all(SourceAccount.account.address);
        const available = balance.availableBalance;
        const transfer = api.tx.balances.transfer(targetAccount.account.address, normalTransferAmount);
        const { partialFee } = await transfer.paymentInfo(targetAccount.account.address);
        const fees = partialFee.muln(110).divn(100);
        const total = normalTransferAmount.add(fees).add(api.consts.balances.existentialDeposit);
        if (total.gt(available)) {
          console.error(
            `Cannot transfer from ${sourceKey} - ${normalTransferAmount} with ${available} left to ${targetKey}`
          );
        }
        else {
          const nonce = await api.rpc.system.accountNextIndex(SourceAccount.account.address);
          const tx = await transfer.signAndSend(SourceAccount.account, { nonce });
          console.log(`Surce key - ${sourceKey} ==> Targte key - ${targetKey}`);
          //   console.log(`Transfered to ${targetKey} amount ${normalTransferAmount};Timestamp ${new Date().toString()};Transfer: ${tx}; `);
        }

      }
      source = target;
    }

  }
}

// function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e8; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}