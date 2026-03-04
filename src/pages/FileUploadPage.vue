<template>
  <div>
    <h1 class="text-h4 mb-4">文件上传</h1>
    <v-card>
      <v-card-text>
        <v-file-input
          label="选择文件"
          variant="outlined"
          prepend-icon="mdi-paperclip"
        />
        <v-btn color="primary" class="mt-4"> 上传 </v-btn>
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
    { title: "文件上传" },
  ]);
});
</script>
