# 5ire-test-suit

The test suit which consists of a Transaction generator and Transaction listener.
Tool will be used to find the TPS fir 5IRE chain. 
  It contains 2 components <br> 
  1) Transaction Generator - load the chain with transactions <br>
  2) Transaction Listner - Listner which listens the number of transactions per block.

**Architectureal view**

 ![image](https://user-images.githubusercontent.com/91786271/144531608-cf1894c4-b2fc-49af-a3b9-0c049cba2646.png)


**Transaction Generator**  
    Creates 5 grid accounts which individually contain the _n_ number of accounts. After account creation accounts will be laod with initial number of tokens from sudo account.
    Chain will be loaded with transaction from one grid of accounts to other as below.

 ![image](https://user-images.githubusercontent.com/91786271/144530759-1f278843-e57a-48fd-bf84-13cdde8c2eeb.png)


## Run Test Suit

To get started -
1. Clone the repo locally, via `git clone https://github.com/5ire-org/5ire-test-suit <optional local path>`.
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >=10.13.0](https://nodejs.org/en/) is recommended.
3. Install the dependencies by running npm install.
4. To load the transaction to chain run `npm run generator --wsnode="" --bank=""`.  
Note: --bank is the seed for the sudo or test account which has the funds..
5. To Listen to chain and to find the transaction per block run `npm run listener --wsnode=""`.

## Environment Variables.
  Below you can parameterize the Test Suit variables in .env file.
  1. tranafer_from_sudo => Amount of tokens transfer to each Test account
  2. transfer_between_acounts => Number of tokens transfer between tetst accounts.
  3. sleep_sudo_transfer => Sleep time to finalize the initial transfer from sudo\Test account.
  4. no_transfer_between_acounts => Number of transfers between test accounts.
  5. no_accounts_per_grid => Number of test accounts in each Grid.
  
