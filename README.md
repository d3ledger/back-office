
Web application for D3 ledger user.

## What is it?
Distributed Digital Depository is a service platform for decentralized safekeeping and settlements of tokenized crypto assets. Financial intermediaries, or custodians, directly participate in the maintenance of the system by auditing exchange process, and by voting during sidechain-to-D3 tokenization process.

[Hyperledger Iroha](https://github.com/hyperledger/iroha) is D3 ledger, which is used for voting (via multisignature accounts) and decentralized data storage.

## Getting started
To start use this application you should run this commands in terminal.
``` bash
$ git clone https://github.com/d3ledger/back-office
$ cd back-office
$ yarn
```

**IMPORTANT** in our application we use `yarn` for dependency management if you do not have it, you should install it - [Installation | Yarn](https://yarnpkg.com/en/docs/install)

#### ENV
1. `VUE_APP_ETH_NOTARY_URL=http://127.0.0.1:8083` - Used to connect to notary etherium registration service, provide IP of notary. Use this ENV when going to run or build application
1. `VUE_APP_BTC_NOTARY_URL=http://127.0.0.1:8084` - Used to connect to notary bitcoin registration service, provide IP of notary. Use this ENV when going to run or build application
2. `CYPRESS_IROHA=http://127.0.0.1:8081` - Used to run e2e tests, provide IP of gRPC IROHA.
3. `CYPRESS_baseUrl=http://127.0.0.1:8080` - Can be used in e2e tests, provide IP of D3 application

#### Data
In our application we are use mock data that historically became our main data. We are use them to fill IROHA, to provide list of nodes or registration services. You can check them in `data` folder.

### How to run
To run application
``` bash
$ yarn serve
```
This will serve application with hot reload.

# serve with hot reload
yarn serve

# build static app for deployment
yarn build # build:more-memory if you run out of heap

# run unit tests
yarn test:unit
```
