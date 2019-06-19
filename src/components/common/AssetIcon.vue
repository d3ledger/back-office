<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <div>
    <img
      v-if="isSora"
      :style="{'height': size + 'px'}"
      src="@/assets/icons/sora.png"
    >
    <i
      v-else-if="isIconPresent"
      :style="{'font-size': size + 'px'}"
      :class="'cc ' + asset.toUpperCase()"
    />
    <img
      v-else
      :style="{width: size+'px'}"
      src="@/assets/icons/coins.svg"
    >
  </div>
</template>

<script>
// TODO: Find better solution to show icons of assets
export default {
  name: 'AssetIcon',

  props: {
    asset: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 24
    }
  },

  data () {
    return {
      coinNames: [
        'ADA',
        'ADC',
        'AEON',
        'AMP',
        'ANC',
        'ARCH',
        'ARDR',
        'ARK',
        'AST',
        'AUR',
        'BANX',
        'BAT',
        'BAY',
        'BC',
        'BLK',
        'BCH',
        'BCC',
        'BCN',
        'BCY',
        'BELA',
        'BFT',
        'BLZ',
        'BNB',
        'BRK',
        'BRX',
        'BSD',
        'BTA',
        'BTC',
        'BTCD',
        'BTCP',
        'BTG',
        'BTM',
        'BTS',
        'BURST',
        'CLAM',
        'CLOAK',
        'CVC',
        'DAO',
        'DASH',
        'DCR',
        'DCT',
        'DGB',
        'DGD',
        'DGX',
        'DMD',
        'DOGE',
        'EMC',
        'EMC2',
        'EOS',
        'ERC',
        'ETC',
        'ETH',
        'EXP',
        'FC2',
        'FCT',
        'FLDC',
        'FLO',
        'FRK',
        'FTC',
        'FUN',
        'GAME',
        'GBYTE',
        'GDC',
        'GEMZ',
        'GLD',
        'GNO',
        'GNT',
        'GOLOS',
        'GRC',
        'GRS',
        'HEAT',
        'HSR',
        'HUC',
        'ICN',
        'ICX',
        'IFC',
        'INCNT',
        'IOC',
        'IOTA',
        'JBS',
        'KMD',
        'KOBO',
        'KORE',
        'LBC',
        'LDOGE',
        'LSK',
        'LTC',
        'MAID',
        'MARKS',
        'Bitmark',
        'MCO',
        'MINT',
        'MONA',
        'MRC',
        'MSC',
        'MTL',
        'MTR',
        'MUE',
        'MYST',
        'NAV',
        'NBT',
        'USNBT',
        'NEO',
        'GAS',
        'NEOS',
        'NEU',
        'NLG',
        'NMC',
        'NMR',
        'NOTE',
        'NVC',
        'NXT',
        'OK',
        'OMG',
        'OMNI',
        'OPAL',
        'PART',
        'PASC',
        'PIGGY',
        'PINK',
        'PIVX',
        'POT',
        'PPC',
        'PPT',
        'QRK',
        'QTUM',
        'RADS',
        'RBIES',
        'RBT',
        'RBY',
        'RDD',
        'REP',
        'RHOC',
        'RIC',
        'RISE',
        'SALT',
        'SAR',
        'SCOT',
        'SDC',
        'SIA',
        'SC',
        'SJCX',
        'STORJ',
        'SLG',
        'SLS',
        'SNRG',
        'SNT',
        'START',
        'STEEM',
        'SBD',
        'STRAT',
        'SWIFT',
        'SYNC',
        'SYS',
        'TRIG',
        'TRX',
        'TX',
        'UBQ',
        'UNITY',
        'USDT',
        'VERI',
        'VET',
        'VIA',
        'VIOR',
        'VNL',
        'VPN',
        'VRC',
        'VTC',
        'WAVES',
        'XAI',
        'XBC',
        'XBS',
        'XCP',
        'XEM',
        'XLM',
        'XMR',
        'XMY',
        'XPM',
        'XRB',
        'XRP',
        'XTZ',
        'XVC',
        'XVG',
        'XZC',
        'YBC',
        'ZEC',
        'ZEIT',
        'ZRX'
      ]
    }
  },

  computed: {
    isIconPresent () {
      return this.coinNames.includes(this.asset.toUpperCase())
    },
    isSora () {
      return this.asset.toUpperCase() === 'XOR'
    }
  }
}
</script>
