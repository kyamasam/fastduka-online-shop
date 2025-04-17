import { toast } from "vue3-toastify";
export function showServerErrors(errorResponse) {
  errorResponse?.errors.map((e) => {

    toast.error(`${e?.attr?.replace("_", " ")} ${e?.detail}`);
  });
  return;
}
