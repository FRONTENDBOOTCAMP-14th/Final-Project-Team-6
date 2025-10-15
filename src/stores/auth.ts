import { create } from "zustand";

type AuthState = {
  isLoggedIn: boolean;
  toggle: () => void;
};

// 임시 Zustand auth 스토어
export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  toggle: () => set((s) => ({ isLoggedIn: !s.isLoggedIn })),
}));
