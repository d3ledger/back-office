<template>
  <router-link class="card" :to="'/wallets/' + walletId">
    <img src="@/assets/icons/coins.svg" class="icon"/>
    <div class="info-container">
      <div class="label">{{ name }}</div>
      <div class="asset">{{ asset }}</div>
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
    }
  }
}
</script>

<style scoped>
.card {
  display: flex;
  width: 100%;
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
  font-size: 1rem;
}

.card.router-link-active > .info-container > .label {
  font-weight: 500;
}

.asset {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-size: 1rem;
}
</style>
