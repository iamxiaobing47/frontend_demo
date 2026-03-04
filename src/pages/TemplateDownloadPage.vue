<template>
  <div>
    <h1 class="text-h4 mb-4">文件模板下载</h1>
    <v-card>
      <v-card-text>
        <p>请下载模板文件并按照格式填写</p>
        <v-btn color="primary" class="mt-4" prepend-icon="mdi-download">
          下载模板
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();

onMounted(() => {
  appStore.setBreadcrumbs([
    { title: "首页", to: "/index" },
    { title: "文件模板下载" },
  ]);
});
</script>
