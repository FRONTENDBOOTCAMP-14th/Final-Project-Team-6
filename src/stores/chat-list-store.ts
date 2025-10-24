import { create } from "zustand";
import type { ChatItemData, ChatItemsState } from "@/app/chat/list/_types";

interface ChatListStore {
  chatItems: ChatItemsState;
  limit: number;
  setChatItems: (items: ChatItemsState) => void;
  updateChatItem: (matchedId: string, updates: Partial<ChatItemData>) => void;
  prependChatItem: (item: ChatItemData) => void;
}

/**
 * 채팅 리스트 전역 상태 관리 (Zustand Store)
 *
 * 역할
 * - 채팅 리스트 데이터를 전역에서 관리
 * - 실시간 업데이트 시 상태 변경
 * - 여러 컴포넌트에서 같은 데이터 공유
 *
 * 왜 필요한가
 * - ChatListRealtime에서 실시간 데이터 받으면 → setChatItems() 호출
 * - ChatListContent에서 chatItems 구독 → 자동 리렌더링
 * - 구독 콜백에서 상태를 변경하면 React가 감지해서 UI 업데이트
 * - 전역 상태가 없으면 props를 전달해줘야해서 복잡한 구조 필요
 */
export const useChatListStore = create<ChatListStore>((set) => ({
  chatItems: [], // 채팅 리스트 (현재 페이지에 보여지는 아이템들)
  limit: 5, // 한 페이지당 보여줄 아이템 개수

  // 채팅 리스트 전체 교체 (페이지 변경 시 사용)
  setChatItems: (items) => set({ chatItems: items }),

  // 특정 채팅방만 업데이트
  // matchedId와 일치하는 아이템만 updates로 병합
  updateChatItem: (matchedId, updates) =>
    set((state) => ({
      chatItems: state.chatItems.map((item) =>
        item.matchedId === matchedId ? { ...item, ...updates } : item,
      ),
    })),

  // 리스트 맨 앞에 새 아이템 추가
  // limit 크기를 초과하면 맨 끝 아이템 제거
  // (limit보다 많으면: 새 아이템 추가 + 마지막 1개 삭제)
  // (limit보다 적으면: 새 아이템만 추가)
  prependChatItem: (item) =>
    set((state) => ({
      chatItems:
        state.chatItems.length >= state.limit
          ? [item, ...state.chatItems.slice(0, state.limit - 1)]
          : [item, ...state.chatItems],
    })),
}));
