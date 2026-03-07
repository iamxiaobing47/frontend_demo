<template>
  <div>
    <h1 class="text-h4 mb-4">文件上传</h1>
    <v-card>
      <v-card-text>
        <v-file-input
          v-model="file"
          label="选择文件"
          variant="outlined"
          prepend-icon="mdi-paperclip"
        />
        <v-btn
          color="primary"
          class="mt-4"
          :loading="loading"
          @click="handleUpload"
        >
          上传
        </v-btn>
        <v-alert v-if="error" type="error" variant="tonal" class="mt-4">
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const file = ref<File[] | null>(null);
const loading = ref(false);
const error = ref("");

const handleUpload = async () => {
  if (!file.value?.length) {
    error.value = "请选择文件";
    return;
  }
  loading.value = true;
  error.value = "";

  setTimeout(() => {
    loading.value = false;
    router.push("/process-result");
  }, 1000);
};
</script>
