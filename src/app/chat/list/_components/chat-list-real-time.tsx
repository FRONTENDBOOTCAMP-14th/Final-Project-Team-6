"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useChatListStore } from "@/stores/chat-list-store";
import { useToastStore } from "@/stores/toast-store";
import { createClient } from "@/utils/supabase/client";
import type { ChatItemsState } from "../_types";

interface ChatListRealtimeProps {
  userId: string;
  initialItems: ChatItemsState;
}

export default function ChatListRealtime({
  userId,
  initialItems,
}: ChatListRealtimeProps) {
  const { chatItems, setChatItems, updateChatItem } = useChatListStore();
  const { showToast } = useToastStore();

  // ----------------------------------------------------------------
  // 1. 현재 페이지 상태 파악
  const pathname = usePathname();
  const isInChatRoom = /^\/chat\/detail\/[^/]+$/.test(pathname);
  const isOnFirstPage =
    !pathname.includes("?page=") || pathname.includes("?page=1");

  // ----------------------------------------------------------------
  // 2. Ref 선언
  // Ref를 사용하는 이유: 실시간 구독 콜백 내에서 최신 상태를 참조하기 위함
  // (useEffect 의존성 배열로 구독을 계속 재생성하는 것을 방지)
  const isInChatRoomRef = useRef(isInChatRoom);
  const chatItemsRef = useRef(chatItems);
  const isOnFirstPageRef = useRef(isOnFirstPage);
  const isInitializedRef = useRef(false);
  const subscriptionRef = useRef<RealtimeChannel | null>(null); // 이전 구독 확실히 제거하기 위한 Ref

  // ----------------------------------------------------------------
  // 3. Ref 업데이트
  // 컴포넌트가 리렌더링될 때마다 ref에 최신 값 저장
  useEffect(() => {
    isInChatRoomRef.current = isInChatRoom;
  }, [isInChatRoom]);

  useEffect(() => {
    isOnFirstPageRef.current = isOnFirstPage;
  }, [isOnFirstPage]);

  useEffect(() => {
    chatItemsRef.current = chatItems;
  }, [chatItems]);

  // ----------------------------------------------------------------
  // 4. 초기화 + 페이지 1 동기화
  // 역할: 서버에서 받은 데이터를 클라이언트 store에 반영
  useEffect(() => {
    if (!isInitializedRef.current) {
      // 첫 초기화
      setChatItems(initialItems);
      chatItemsRef.current = initialItems;
      isInitializedRef.current = true;
    } else if (isOnFirstPageRef.current) {
      // 페이지 1에서만 업데이트
      setChatItems(initialItems);
      chatItemsRef.current = initialItems;
    }
  }, [initialItems, setChatItems]);

  // ----------------------------------------------------------------
  // 5. Supabase 실시간 구독
  // 역할: 데이터베이스 변경사항 감지하고 토스트/업데이트 처리
  useEffect(() => {
    const setupSubscription = async () => {
      const supabase = createClient();

      // 잠시 대기 (연결 안정화)
      await new Promise((resolve) => setTimeout(resolve, 150));

      // ----------------------------------------------------------------
      // 5-1. 메시지 수신 구독
      // 감지: 새 메시지가 chat_messages 테이블에 INSERT될 때
      // 새 채팅방이 생겼을 때도 메시지가 들어오기 때문에 이 구독 하나로 처리 가능
      const messageSubscription = supabase
        .channel(`chat_${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
          },
          async (payload) => {
            // payload.new를 안전하게 타입 캐스팅
            const newMessage = payload.new as {
              sender_id: string;
              room_id: string;
              body: string;
              created_at: string;
            };

            // 기본 필터링
            // 1) 내가 보낸 메시지면 무시
            // 2) 내가 현재 채팅방에 있으면 무시
            if (newMessage.sender_id === userId) {
              return;
            }
            if (isInChatRoomRef.current) {
              return;
            }

            try {
              // 채팅방 정보 조회
              const { data: room } = await supabase
                .from("chat_rooms")
                .select(`
                    id,
                    matches!chat_rooms_matches_id_fkey (
                      id,
                      matched_runner_id,
                      status
                    ),
                    posts (
                      title,
                      author_id
                    )
                  `)
                .eq("id", newMessage.room_id)
                .single();

              // 채팅방이 없거나 매칭이 완료되지 않으면 무시
              if (!room || room.matches.status !== "matched") {
                console.log("채팅방 없거나 매칭 미완료");
                return;
              }

              // 권한 확인: 이 사용자가 해당 채팅방에 참여 중인가?
              const authorId = room.posts.author_id;
              const matchedRunnerId = room.matches.matched_runner_id;

              if (authorId !== userId && matchedRunnerId !== userId) {
                console.log("권한 없음");
                return;
              }

              // 상대방 프로필 정보 가져오기
              const isAuthor = authorId === userId;
              const { data: opponent } = await supabase
                .from("profiles")
                .select("id, nickname, runner_type, profile_image_url")
                .eq("id", isAuthor ? matchedRunnerId : authorId)
                .single();

              if (!opponent) {
                console.log("상대방 정보 없음");
                return;
              }

              // 현재 리스트에 이 채팅방이 있는지 확인
              const targetItem = chatItemsRef.current.find(
                (item) => item.roomId === newMessage.room_id,
              );

              // 기존 채팅방: 마지막 메시지 업데이트 (모든 페이지에서 가능)
              if (targetItem && isOnFirstPageRef.current) {
                updateChatItem(targetItem.matchedId, {
                  lastMessage: newMessage.body,
                  lastMessageTime: newMessage.created_at,
                });
              }

              // 항상 토스트 표시 (모든 상황에서 사용자에게 알림)
              showToast(`${opponent.nickname}님: ${newMessage.body}`);
            } catch (error) {
              console.error("메시지 처리 오류:", error);
            }
          },
        )
        .subscribe();

      subscriptionRef.current = messageSubscription;
    };

    setupSubscription();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe().catch(console.error);
        subscriptionRef.current = null;
      }
    };
  }, [userId, showToast, updateChatItem]);

  return null;
}
