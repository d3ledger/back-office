const irohaHelpersLib = require('iroha-helpers/lib/chain')
const fs = require('fs')

const tx = new irohaHelpersLib.TxBuilder()
  .transferAsset({
    amount: '0.00001',
    assetId: 'btc#bitcoin',
    description: '111111',
    destAccountId: 'b@sora',
    srcAccountId: 'a@sora'
  })
  .transferAsset({
    amount: '0.00002',
    assetId: 'btc#bitcoin',
    description: '222222',
    destAccountId: 'b@sora',
    srcAccountId: 'a@sora'
  })
  .transferAsset({
    amount: '0.00003',
    assetId: 'btc#bitcoin',
    description: '333333',
    destAccountId: 'b@sora',
    srcAccountId: 'a@sora'
  })
  .transferAsset({
    amount: '0.00004',
    assetId: 'btc#bitcoin',
    description: '444444',
    destAccountId: 'b@sora',
    srcAccountId: 'a@sora'
  })
  .transferAsset({
    amount: '0.00005',
    assetId: 'btc#bitcoin',
    description: '555555',
    destAccountId: 'b@sora',
    srcAccountId: 'a@sora'
  })
  .addMeta('a@sora', 3)
  .sign([
    'e8d1bee5f4cc5d83a1cd9b2ad9692b2c1f3cdeff8d1ed4da382a130e0f5e5a29'
  ])
  .tx
  .serializeBinary()

fs.writeFile(`./generated-transaction.bin`, Buffer.from(tx), (err) => {
  if (err) throw err
})
