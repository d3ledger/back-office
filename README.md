
# D3
<p align="center">
  <img src="src/assets/logo.svg">
</p>

## What is it?
**D3** is a web application for D3 ledger user.

## Getting started
To start use this application you should run this commands in terminal.
``` bash
$ git clone https://github.com/d3ledger/back-office
$ cd back-office
$ yarn
```

**IMPORTANT** in our application we use `yarn` for dependency management if you do not have it, you should install it - [Installation | Yarn](https://yarnpkg.com/en/docs/install)

### How to run
To run application
``` bash
$ yarn serve
```
This will serve application with hot reload.

### How to build
To build application for deployment
``` bash
$ yarn build
```

If you run out of memory while building application you can try another command, but it requires at least **4GB** of RAM
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