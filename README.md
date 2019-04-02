
# D3
<p align="center">
  <img src="src/assets/logo.svg">
</p>

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
1. `registration.json` - contains urls of nodes with registration services.
2. `nodes.json` - contains urls of iroha nodes.
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

To run Iroha
``` bash
$ yarn start-iroha
```

### How to build
To build application for deployment
``` bash
$ yarn build
```
When application will finish building, you will have the directory `dist` that need to place on the server. Also the `dist` will contains 2 files - `registration.json` and `nodes.json`. They can be replaced with another files that provides new urls.

If you are run out of memory while building application you can try another command, but it requires at least **4GB** of RAM
``` bash
$ yarn build:more-memory
```

### How to test
To run tests all unit tests
``` bash
$ yarn test:unit
```

To run all e2e tests
``` bash
$ yarn test:e2e
```

**IMPORTANT** to run any e2e test need to provide `CYPRESS_IROHA`.

``` bash
$ CYPRESS_IROHA=http://127.0.0.1:8081 yarn test:e2e
```