"use client";

import { create } from "zustand";

interface ToastState {
  message: string;
  isVisible: boolean;
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  isVisible: false,

  showToast: (message, duration = 3000) => {
    set({ message, isVisible: true });
    // duration 후 자동 숨김
    setTimeout(() => set({ isVisible: false }), duration);
  },

  hideToast: () => set({ isVisible: false }),
}));
