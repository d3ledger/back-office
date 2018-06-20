const coinNames = [
  'ADA',
  'ADC',
  'AEON',
  'AMP',
  'ANC',
  'ARCH',
  'ARDR',
  'ARK',
  'AUR',
  'BANX',
  'BAT',
  'BAY',
  'BC',
  'BCH',
  'BCN',
  'BFT',
  'BRK',
  'BRX',
  'BSD',
  'BTA',
  'BTC',
  'BTCD',
  'BTM',
  'BTS',
  'CLAM',
  'CLOAK',
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
  'EOS',
  'ERC',
  'ETC',
  'ETH',
  'FC2',
  'FCT',
  'FLO',
  'FRK',
  'FTC',
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
  'ICN',
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
  'MCO',
  'MINT',
  'MONA',
  'MRC',
  'MSC',
  'MTR',
  'MUE',
  'NBT',
  'NEO',
  'NEOS',
  'NEU',
  'NLG',
  'NMC',
  'NOTE',
  'NVC',
  'NXT',
  'OK',
  'OMG',
  'OMNI',
  'OPAL',
  'PART',
  'PIGGY',
  'PINK',
  'PIVX',
  'POT',
  'PPC',
  'QRK',
  'QTUM',
  'RADS',
  'RBIES',
  'RBT',
  'RBY',
  'RDD',
  'REP',
  'RISE',
  'SALT',
  'SAR',
  'SCOT',
  'SDC',
  'SIA',
  'SJCX',
  'SLG',
  'SLS',
  'SNRG',
  'START',
  'STEEM',
  'STR',
  'STRAT',
  'SWIFT',
  'SYNC',
  'SYS',
  'TRIG',
  'TX',
  'UBQ',
  'UNITY',
  'USDT',
  'VIOR',
  'VNL',
  'VPN',
  'VRC',
  'VTC',
  'WAVES',
  'XAI',
  'XBS',
  'XCP',
  'XEM',
  'XMR',
  'XPM',
  'XRP',
  'XTZ',
  'XVG',
  'XZC',
  'YBC',
  'ZEC',
  'ZEIT'
]

var assetIcon = {
  methods: {
    isIconPresent: asset => coinNames.includes(asset.toUpperCase())
  }
}

export default assetIcon