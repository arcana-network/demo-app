import { inject } from "vue";

const SUCCESS_OPTIONS = {
  styles: {
    backgroundColor: "green",
  },
  type: "success",
};

const ERROR_OPTIONS = {
  styles: {
    backgroundColor: "red",
  },
  type: "error",
};

function useToast() {
  const toast = inject("$toast");

  function toastSuccess(msg) {
    toast(msg, SUCCESS_OPTIONS);
  }

  function toastError(msg = "Something went wrong.") {
    toast(msg, ERROR_OPTIONS);
  }

  return { toastSuccess, toastError };
}

export default useToast;
