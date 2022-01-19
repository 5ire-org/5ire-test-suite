# 5ire-functional-testing

The test consists of simple functional testing to be used for testing 5ireChain and sdk

The test uses 5ireChain as ref and source of truth while testing sdk and uses javascript sdk as source of truth for testing 5ireChain. This interdependency allows to keep both the repos in sync for the tested funtionality.
The unit tests are written in chai with js using `@5ire/api` npm package.

## Run Test Suite

Install packages
```bash
npm i
```
Run test script
```bash
npm run test
```

Further documentation for npm package can be found [here](https://github.com/5ire-org/5ire-js-api) and for 5irechain [here](https://github.com/5ire-org/5ireChain)
