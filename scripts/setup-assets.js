/* eslint-disable no-unused-vars */
/* eslint-disable no-return-await */
/*
 * NODE_IP=http://localhost:8080 DEBUG=iroha-util node scripts/setup.js
 */

import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import {
  derivePublicKey
} from 'ed25519.js'

import grpc from 'grpc'
import {
  QueryService_v1Client as QueryService,
  CommandService_v1Client as CommandService
} from 'iroha-helpers/lib/proto/endpoint_grpc_pb'
import { commands, queries } from 'iroha-helpers'

const irohaDomain = 'd3'
const adminDomain = 'notary'

const adminAcccountName = 'admin'
const adminAcccountFull = `${adminAcccountName}@${adminDomain}`
const adminPrivateKeyHex = fs.readFileSync(path.join(__dirname, `${adminAcccountFull}.priv`)).toString().trim()

const NODE_IP = process.env.NODE_IP || 'localhost:50051'
const DEFAULT_TIMEOUT_LIMIT = 5000
const DUMMY_FILE_PATH = path.join(__dirname, '../src/data/wallets.json')
const wallets = require(DUMMY_FILE_PATH).wallets

console.log('\x1b[33m%s\x1b[0m', '#### INFO ####')
console.log(`setting up accounts and assets with using '${DUMMY_FILE_PATH}'`)
console.log(`assets: ${wallets.map(w => w.name).join(', ')}`)
console.log('\x1b[33m%s\x1b[0m', '#### INFO ####\n')

function newCommandServiceOptions (privateKeys, quorum, accountId) {
  return {
    privateKeys,
    quorum,
    creatorAccountId: accountId,
    commandService: new CommandService(
      NODE_IP,
      grpc.credentials.createInsecure()
    ),
    timeoutLimit: DEFAULT_TIMEOUT_LIMIT
  }
}

async function initializeAssets () {
  console.log('initializing assets')

  for (let w of wallets) {
    const precision = w.precision
    const amount = w.amount
    const assetName = w.asset.toLowerCase()
    let assetId = `${assetName}#${irohaDomain}`

    console.log('\x1b[36m%s\x1b[0m', `#### ${assetName} BEGIN ####`)

    await tryToCreateAsset(assetName, irohaDomain, precision)
    await tryAddAssetQuantity(assetId, amount)

    console.log('\x1b[36m%s\x1b[0m', `#### ${assetName} END ####`)
  }
}

async function tryToCreateAsset (assetName, domainId, precision) {
  console.log(`trying to create an asset: ${assetName}#${domainId} (precision=${precision})`)
  try {
    await commands.createAsset(
      newCommandServiceOptions([adminPrivateKeyHex], 1, adminAcccountFull),
      {
        assetName,
        domainId,
        precision
      }
    )
    console.log(`${assetName}#${domainId} (precision: ${precision}) has successfully been created`)
  } catch (error) {
    console.log(`${assetName}#${domainId} (precision=${precision}) already exist`)
  }
}

async function tryAddAssetQuantity (assetId, amount) {
  console.log(`adding initial amount of ${assetId} to ${adminAcccountFull}`)
  try {
    await commands.addAssetQuantity(
      newCommandServiceOptions([adminPrivateKeyHex], 1, adminAcccountFull),
      {
        assetId,
        amount
      }
    )
  } catch (error) {
    console.log(`Error! Asset quantity not added ${assetId} ${amount}`)
  }
}

Promise.resolve().then(initializeAssets)
