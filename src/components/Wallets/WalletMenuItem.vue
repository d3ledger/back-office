<template>
  <router-link class="card" :to="'/wallets/' + walletId">
    <i v-if="isIconPresent(asset)" :class="'icon cc ' + asset.toUpperCase()"></i>
    <img v-else src="@/assets/icons/coins.svg" class="icon"/>
    <div class="info-container">
      <div class="label">{{ name }}</div>
      <div class="asset">{{ asset }}</div>
    </div>
  </router-link>
</template>

<script>
import assetIcon from '@/components/mixins/assetIcon'

export default {
  mixins: [assetIcon],
  props: {
    walletId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    asset: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  display: flex;
  width: 100%;
  font-size: 14px;
  text-decoration: none;
  align-items: center;
  padding: 15px 20px;
}

.card.router-link-active {
  background: #f4f4f4;
  padding-bottom: 14px;
  border-bottom: 1px solid #2d2d2d;
}

.icon {
  width: 24px;
  margin-right: 20px;
  font-size: 24px;
}

.info-container {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
}

.card.router-link-active > .info-container > .label {
  font-weight: 600;
}

.card.router-link-active > .info-container > .asset {
  color: #000000;
  font-weight: 600;
}

.asset {
  color: rgba(0, 0, 0, 0.6);
}
</style>
