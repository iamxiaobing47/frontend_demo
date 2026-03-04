<template>
  <div>
    <h1 class="text-h4 mb-4">控制台</h1>
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="text-center">
            <v-icon icon="mdi-account-group" size="48" color="primary" />
            <div class="text-h5 mt-2">1,234</div>
            <div class="text-grey">用户总数</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="text-center">
            <v-icon icon="mdi-cart" size="48" color="success" />
            <div class="text-h5 mt-2">567</div>
            <div class="text-grey">订单数量</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="text-center">
            <v-icon icon="mdi-currency-usd" size="48" color="warning" />
            <div class="text-h5 mt-2">$8,901</div>
            <div class="text-grey">总收入</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onMounted(() => {
  appStore.setBreadcrumbs([
    { title: '首页', to: '/' },
    { title: '控制台' }
  ])
})
</script>
