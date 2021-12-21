// Required imports
require('dotenv').config();
const { genLogger: logger } = require('../utils/logger');

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
let testAccountArrRev = [earthArr, waterArr, fireArr, airArr, spaceArr];
let normalTransferAmount;
let no_transfer_between_acounts = process.env.no_transfer_between_acounts;
let no_accounts_per_grid = process.env.no_accounts_per_grid;
async function createAccounts() {
  // Retrieve the chain & node information information via rpc calls
  // Initialise the provider to connect to the local node
  console.log(process.env.ws_node)
  console.log(process.env.bank)
  provider = new WsProvider(process.env.ws_node);

  // Create the API and wait until ready
  api = await ApiPromise.create({ provider });
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);
  logger.info(`Connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

  sudoAccount = createAccount(process.env.bank);
  for (let i = 1; i < no_accounts_per_grid; i++) {
    spaceArr.set('spaceAccount' + i, createAccount());
    airArr.set('airAccount' + i, createAccount());
    fireArr.set('fireAccount' + i, createAccount());
    waterArr.set('waterAccount' + i, createAccount());
    earthArr.set('earthAccount' + i, createAccount());
  }
}
async function main() {
  console.log("Test....")
  // Create test accounts
  await createAccounts();
  //const test1Account = createAccount();
  // Build Initial transfer amount
  const decims = new BN(api.registry.chainDecimals);
  const factor = new BN(10).pow(decims);
  const initialTransferAmount = new BN(process.env.tranafer_from_sudo).mul(factor);

  // Build Normal transfer amount
  const normalDecims = new BN(api.registry.chainDecimals);
  const normalFactor = new BN(10).pow(normalDecims);
  normalTransferAmount = new BN(process.env.transfer_between_acounts).mul(normalFactor);

  const balance = await api.derive.balances.all(sudoAccount.account.address);
  const available = balance.availableBalance;

  // Transfering initial amount to test accounts
  //testAccountArr.forEach(async (element) => {
  for (const grid of testAccountArr) {
    for (let [key, value] of (grid)) {
      const transfer = api.tx.balances.transfer(value.account.address, initialTransferAmount);
      const { partialFee } = await transfer.paymentInfo(value.account.address);
      const fees = partialFee.muln(110).divn(100);
      const total = initialTransferAmount.add(fees).add(api.consts.balances.existentialDeposit);
      if (total.gt(available)) {
        logger.error(
          `Cannot transfer ${initialTransferAmount} with ${available} left to ${key}`
        );
      }
      else {
        const nonce = await api.rpc.system.accountNextIndex(sudoAccount.account.address);
        const tx = await transfer.signAndSend(sudoAccount.account, { nonce });
        //logger.info(`Transfered to ${key} - ${value.account.address} amount ${initialTransferAmount}; Transfer: ${tx}; `);
        logger.info(`Transfered to ${key} - ${value.account.address}; Transfer: ${tx};`);
      }
    }
  }

  sleep(process.env.sleep_sudo_transfer);
  for (let l = 0; l < no_transfer_between_acounts; l++) {
    await transferBetweenGrids(testAccountArr);
    await transferBetweenGrids(testAccountArrRev);
  }
}

main().catch(logger.error).finally(() => process.exit());

// Creates test account.
function createAccount(mnemonic) {
  mnemonic = mnemonic && mnemonicValidate(mnemonic)
    ? mnemonic
    : mnemonicGenerate();
  const account = keyring.addFromMnemonic(mnemonic);
  // logger.info(`Addr: ${account.address}- ${mnemonic}`)
  return { account, mnemonic };
}

// Transfer between the Grids
async function transferBetweenGrids(testAccountArrLocal) {
  let source = new Map();
  source.set('sudoAccount', sudoAccount);
  for (const target of testAccountArrLocal) {
    for (let [sourceKey, SourceAccount] of (source)) {
      let nonce = await api.rpc.system.accountNextIndex(SourceAccount.account.address);
      //logger.info(SourceAccount.account.address)
      for (let [targetKey, targetAccount] of (target)) {
        //logger.info(targetAccount.account.address);
        const balance = await api.derive.balances.all(SourceAccount.account.address);
        const available = balance.availableBalance;
        const transfer = api.tx.balances.transfer(targetAccount.account.address, normalTransferAmount);
        const { partialFee } = await transfer.paymentInfo(targetAccount.account.address);
        const fees = partialFee.muln(110).divn(100);
        const total = normalTransferAmount.add(fees).add(api.consts.balances.existentialDeposit);
        if (total.gt(available)) {
          logger.error(
            `Cannot transfer from ${sourceKey} - ${normalTransferAmount} with ${available} left to ${targetKey}`
          );
        }
        else {
          //const nonce = await api.rpc.system.accountNextIndex(SourceAccount.account.address);
          try {
            const tx = await transfer.signAndSend(SourceAccount.account, { nonce });
            nonce = nonce.add(new BN(1));
          } catch (err) {
            console.error(err);
          }
          logger.info(`${sourceKey} ==> ${targetKey}`);
          //   logger.info(`Transfered to ${targetKey} amount ${normalTransferAmount};Timestamp ${new Date().toString()};Transfer: ${tx}; `);
        }
      }
      source = target;
    }

  }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e8; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}