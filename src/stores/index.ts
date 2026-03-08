import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { testApi } from "@/services/test";

export const useIndexStore = defineStore("index", () => {
  const loading = ref(false);
  const data = ref<string | undefined>(undefined);
  const error = ref("");

  const result = computed({
    get: () => {
      const val = data.value ?? "";
      console.log("IndexStore result computed GET - data.value:", data.value, "result:", val);
      return val;
    },
    set: (val) => {
      console.log("IndexStore result computed SET:", val);
    }
  });

  const fetchTest = async () => {
    console.log("IndexStore fetchTest - before execute, data:", data.value);
    loading.value = true;
    error.value = "";
    try {
      const response = await testApi();
      console.log("IndexStore fetchTest - testApi result:", response);
      data.value = response;
    } catch (e: any) {
      console.log("IndexStore fetchTest - error:", e);
      error.value = e.message || "请求失败";
    } finally {
      loading.value = false;
    }
    console.log("IndexStore fetchTest - after execute, data:", data.value, "result:", result.value);
  };

  const clearResult = () => {
    data.value = undefined;
    error.value = "";
  };

  return {
    loading,
    result,
    error,
    fetchTest,
    clearResult,
  };
});
