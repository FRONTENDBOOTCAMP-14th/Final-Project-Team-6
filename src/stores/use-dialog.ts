import type { ReactNode } from "react";
import { create } from "zustand";

type ModalType = "alert" | "confirm" | "custom" | null;

interface DialogState {
  type: ModalType;
  content?: ReactNode; // CustomModal용 (ex. 리스트 필터 모달 / form 등을 컴포넌트를 콘텐츠로 구성하여 전달)
  message?: string; // Alert, Confirm용 (ex. 로그인이 필요합니다. 로그인 하시겠습니까?)
  onConfirm?: () => void; // Confirm용 (ex. 확인시 route를 통해 페이지 이동시키거나 하는 형식)
  openDialog: (type: ModalType, options?: Partial<DialogState>) => void;
  closeDialog: () => void;
}

const dialogStateInit = {
  type: null,
  content: undefined,
  message: undefined,
  onConfirm: undefined,
};

export const useDialog = create<DialogState>((set) => ({
  ...dialogStateInit,
  openDialog: (type, options = {}) => set({ type, ...options }),
  closeDialog: () => set(dialogStateInit),
}));
