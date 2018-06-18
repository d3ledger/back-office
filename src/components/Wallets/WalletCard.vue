<template>
  <router-link class="card" :to="'/wallets/' + walletId" :style="{ backgroundColor: '#' + color }">
    <img src="@/assets/icons/coins.svg" class="icon"/>
    <div class="info-container">
      <div class="amount">{{ amount }}</div>
      <div class="label">{{ name }}</div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    walletId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    asset: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: () => '409EFF'
    },
    icon: {
      type: String,
      default: () => 'coins.svg'
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
