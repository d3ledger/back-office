<template>
  <el-row style="margin-bottom: 0.5rem">
    <el-col :span="24">
      <el-row :gutter="8">
        <el-col :span="12">
          <el-card
            :body-style="{ padding: '0' }"
            class="card"
          >
            <div class="card_header">
              <div class="card_header-title">
                <div>{{ wallet.name }}</div>
                <asset-icon
                  :asset="wallet.asset"
                  :size="17"
                  style="color: black;"
                />
              </div>
            </div>
            <div class="top-left-card">
              <div class="amount">
                <el-tooltip
                  :content="`${ amountWithPrecision } ${ wallet.asset }`"
                  class="item"
                  effect="dark"
                  placement="top-start"
                >
                  <h2 class="text-overflow">{{ wallet.amount | fitAmount }} {{ wallet.asset }}</h2>
                </el-tooltip>
              </div>
              <div class="card_actions">
                <div
                  v-if="accountExist"
                  role="button"
                  class="card_actions-button button"
                  @click="receiveFormVisible = true"
                >
                  <fa-icon
                    class="card_actions-button-text"
                    icon="angle-double-down"
                  />
                  <span
                    class="card_actions-button-text"
                    data-cy="deposit"
                  >Deposit</span>
                </div>
                <div
                  v-if="accountExist"
                  role="button"
                  class="card_actions-button button"
                  @click="onOpenWithdrawalForm"
                >
                  <fa-icon
                    class="card_actions-button-text"
                    icon="angle-double-up"
                  />
                  <span
                    class="card_actions-button-text"
                    data-cy="withdraw"
                  >Withdraw</span>
                </div>
                <div
                  role="button"
                  class="card_actions-button button"
                  @click="onOpenTransferForm"
                >
                  <fa-icon
                    class="card_actions-button-text"
                    icon="arrow-right"
                  />
                  <span
                    class="card_actions-button-text"
                    data-cy="transfer"
                  >Transfer</span>
                </div>
                <div
                  role="button"
                  class="card_actions-button button"
                  @click="openExchangeDialog(wallet.asset)"
                >
                  <fa-icon
                    class="card_actions-button-text"
                    icon="exchange-alt"
                  />
                  <span
                    class="card_actions-button-text"
                    data-cy="exchange"
                  >Exchange</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card
            :body-style="{ padding : '0' }"
            class="card"
          >
            <div class="card_header-divided">
              <div class="card_header-title">
                <div class="card_header-name">Market</div>
                <div class="card_header-filter">
                  <div
                    v-for="period in marketPeriods"
                    :key="period"
                    :class="[selectedMarketPeriod !== period ? 'chart_time-filter' : 'chart_time-filter selected']"
                    @click="selectedMarketPeriod = period"
                  >
                    <p class="chart_time-filter_value">{{ period }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-loading="cryptoInfo.isLoading"
              class="card-info"
            >
              <el-row style="margin-bottom: 20px">
                <el-col :span="9">
                  <p
                    :title="`the current price of 1 ${wallet.asset} in ${settingsView.fiat}`"
                    class="card-info-amount"
                  >
                    {{ cryptoInfo.current.fiat | formatNumberLong }} {{ currencySymbol }}
                  </p>

                  <p
                    :class="[cryptoInfo.current.fiat_change > 0 ? 'uptrend' : 'downtrend']"
                    :title="`the change (${settingsView.fiat}) from ${selectedMarketPeriod} ago`"
                  >
                    {{ cryptoInfo.current.fiat_change | formatNumberShort }}
                  </p>
                </el-col>
                <el-col :span="15">
                  <p
                    :title="`the current price of 1 ${wallet.asset} in ${settingsView.crypto}`"
                    class="card-info-amount"
                  >
                    {{ cryptoInfo.current.crypto | formatNumberLong }} {{ settingsView.crypto }}
                  </p>

                  <p
                    :class="[cryptoInfo.current.crypto_change > 0 ? 'uptrend' : 'downtrend']"
                    :title="`the change (%) from ${selectedMarketPeriod} ago`"
                  >
                    {{ cryptoInfo.current.crypto_change | formatPercent }}
                  </p>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="9">
                  <p class="card-info-title">Market Cap</p>
                  <p
                    :title="`the market cap in ${settingsView.fiat}`"
                    class="card-info-amount--small"
                  >
                    {{ cryptoInfo.market.cap.fiat | formatNumberShort }} {{ currencySymbol }}
                  </p>
                  <p
                    :title="`the market cap in ${wallet.asset}`"
                    class="card-info-amount--small"
                  >
                    {{ cryptoInfo.market.cap.crypto | formatNumberShort }} {{ wallet.asset }}
                  </p>
                </el-col>
                <el-col :span="8">
                  <p class="card-info-title">Volume ({{ selectedMarketPeriod }})</p>
                  <p
                    :title="`the amount ${wallet.asset} has been traded in ${selectedMarketPeriod} against ALL its trading pairs, in terms of ${settingsView.fiat}`"
                    class="card-info-amount--small"
                  >
                    {{ cryptoInfo.market.volume.fiat | formatNumberShort }} {{ currencySymbol }}
                  </p>
                  <p
                    :title="`the amount ${wallet.asset} has been traded in ${selectedMarketPeriod} against ALL its trading pairs, in terms of ${wallet.asset}`"
                    class="card-info-amount--small"
                  >
                    {{ cryptoInfo.market.volume.crypto | formatNumberShort }} {{ wallet.asset }}
                  </p>
                </el-col>
                <el-col :span="7">
                  <p class="card-info-title">Circulating Supply</p>
                  <p
                    :title="`the total supply in ${wallet.asset}`"
                    class="card-info-amount--small"
                  >
                    {{ cryptoInfo.market.supply | formatNumberShort }} {{ wallet.asset }}
                  </p>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { lazyComponent } from '@router'
import AssetIcon from '@/components/common/AssetIcon'
import numberFormat from '@/components/mixins/numberFormat'

export default {
  components: {
    AssetIcon,

    DepositModal: lazyComponent(),
    TransferModal: lazyComponent(),
    WithdrawalModal: lazyComponent()
  },
  filters: {
    fitAmount (amount) {
      return numberFormat.filters.formatPrecision(amount)
    }
  },
  props: {
    wallet: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters([
      'ethWalletAddress',
      'btcWalletAddress'
    ]),
    amountWithPrecision () {
      return numberFormat.filters.formatPrecision(this.wallet.amount)
    },
    accountExist () {
      const assetDomain = this.wallet.assetId.split('#')[1]

      if (assetDomain === 'bitcoin' && this.btcWalletAddress) {
        return true
      }

      if ((assetDomain === 'ethereum' ||
        assetDomain === 'd3' ||
        assetDomain === 'sora') && this.ethWalletAddress) {
        return true
      }

      return false
    }
  },
  methods: {
  }
}
</script>

<style>

</style>
