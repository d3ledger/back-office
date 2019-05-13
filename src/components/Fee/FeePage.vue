<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :xs="24" :lg="{ span: 18, offset: 3 }" :xl="{ span: 16, offset: 4 }">
          <el-card :body-style="{ padding: '0' }">
            <div class="header">
              <span>Fee setting</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'
import currencySymbol from '@/components/mixins/currencySymbol'
import {
  errorHandler
} from '@/components/mixins/validation'
// import { required } from 'vuelidate/lib/validators'

export default {
  name: 'explorer-page',
  mixins: [
    dateFormat,
    currencySymbol,
    errorHandler
  ],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'availableAssets'
    ])
  },

  methods: {
    ...mapActions([
    ])
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem;
}
</style>
