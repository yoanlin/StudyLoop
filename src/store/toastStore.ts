import { create } from "zustand";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error";
  timeoutId?: NodeJS.Timeout;
};

interface ToastStore {
  toasts: Toast[];
  showToast: (message: string, type: "success" | "error") => void;
  removeToast: (id: string) => void;
  pauseTimeout: (id: string) => void;
  resumeTimeout: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, type) => {
    const id = Date.now().toString();

    const timeoutId = setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 4000);

    set((state) => ({
      toasts: [...state.toasts, { id, message, type, timeoutId }],
    }));
  },
  removeToast: (id) => {
    set((state) => {
      const toast = state.toasts.find((t) => t.id === id);
      if (toast?.timeoutId) clearTimeout(toast.timeoutId);
      return {
        toasts: state.toasts.filter((toast) => toast.id !== id),
      };
    });
  },
  pauseTimeout: (id) => {
    set((state) => {
      const toast = state.toasts.find((t) => t.id === id);
      if (toast?.timeoutId) clearTimeout(toast.timeoutId);
      return {
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, timeoutId: undefined } : t
        ),
      };
    });
  },
  resumeTimeout: (id) => {
    set((state) => {
      const newTimeoutId = setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, 4000);
      return {
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, timeoutId: newTimeoutId } : t
        ),
      };
    });
  },
}));
