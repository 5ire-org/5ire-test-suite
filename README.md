# 5ire-test-suite

This test suit consists of a Transaction generator/listener and functional tests for 5ireChain.

**Transaction generator**
This test suit which consists of a Transaction generator and Transaction listener.
This Tool will be used to find the TPS for 5IRE chain. 
  It contains 2 components
  1) Transaction Generator - load the chain with transactions
  2) Transaction Listner - Listner which listens the number of transactions per block.

**Functional test**
The test consists of simple functional testing to be used for testing 5ireChain and sdk. 
It tests the following basic features:
* connect to provider
* constants on chain
* EVM balances on chain
* native balances on chain
* blocks being generated
* sign and send txn