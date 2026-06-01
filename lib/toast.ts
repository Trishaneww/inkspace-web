// HTML Components
import { toast as toastPrimitive } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

export function displayToast(
  message: string,
  type: ToastType,
  description?: string,
) {
  toastPrimitive[type](message, {
    description,
    duration: 6000,
    position: getToastPosition(),
  });
}

function getToastPosition() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
  ) {
    return "top-center" as const;
  }
  return "bottom-right" as const;
}
