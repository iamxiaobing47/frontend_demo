<template>
  <div>
    <h1 class="text-h4 mb-4">首页</h1>
    <v-card>
      <v-card-text>
        <p>欢迎使用系统</p>
        <v-btn
          color="primary"
          class="mt-4"
          :loading="indexStore.loading"
          @click="handleFetchTest"
        >
          测试API
        </v-btn>
        <v-alert v-if="indexStore.result" type="success" variant="tonal" class="mt-4">
          {{ indexStore.result }}
        </v-alert>
        <v-alert v-if="indexStore.error" type="error" variant="tonal" class="mt-4">
          {{ indexStore.error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from "vue";
import { useAppStore } from "@/stores/app";
import { useIndexStore } from "@/stores/index";

const appStore = useAppStore();
const indexStore = useIndexStore();

console.log("IndexPage - indexStore:", indexStore);
console.log("IndexPage - indexStore.result:", indexStore.result, "Type:", typeof indexStore.result);

onMounted(() => {
  appStore.setBreadcrumbs([]);
});

// 添加按钮点击的调试
const handleFetchTest = async () => {
  console.log("Before fetch - result:", indexStore.result, "error:", indexStore.error);
  await indexStore.fetchTest();
  await nextTick();
  console.log("After fetch - result:", indexStore.result, "error:", indexStore.error);
};
</script>
