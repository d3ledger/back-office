<template>
  <router-link class="card" :to="'/wallet/' + asset" :style="{ backgroundColor: '#' + color }">
    <i v-if="isIconPresent(asset)" :class="'icon cc ' + asset.toUpperCase()"></i>
    <img v-else src="@/assets/icons/coins.svg" class="icon"/>
    <div class="info-container">
      <div class="amount">{{ amount }}</div>
      <div class="label">{{ name }}</div>
    </div>
  </router-link>
</template>

<script>
import assetIcon from '@/components/mixins/assetIcon'

export default {
  name: 'wallets-card',
  mixins: [assetIcon],
  props: {
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    asset: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: () => '000000'
    }
  }
}
</script>

<style scoped>
.card {
  display: flex;
  margin: 20px 0;
  min-width: 260px;
  border-radius: 6px;
  color: white;
  text-decoration: none;
  align-items: center;
}

.icon {
  font-size: 40px;
  width: 40px;
  margin: 0 15px;
}

.info-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 15px 0;
}

.amount {
  margin-bottom: .25rem;
  font-weight: 900;
  font-size: 2rem;
}

.label {
  font-weight: 600;
  font-size: 1rem;
}
</style>
