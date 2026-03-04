import { ref } from "vue";
import { testApi } from "@/services/test";

export function useTestApi() {
  const loading = ref(false);
  const result = ref<string>("");
  const error = ref<string>("");

  const fetch = async () => {
    loading.value = true;
    error.value = "";
    result.value = await testApi();
  };

  return {
    loading,
    result,
    error,
    fetch,
  };
}
