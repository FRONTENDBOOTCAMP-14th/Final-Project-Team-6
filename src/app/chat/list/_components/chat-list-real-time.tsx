"use client";

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
    const supabase = createClient();

    const timestamp = Date.now();
    const messageChannel = `chat_messages_updates_${userId}_${timestamp}`;
    const roomChannel = `chat_rooms_insert_${userId}_${timestamp}`;

    // ----------------------------------------------------------------
    // 5-1. 메시지 수신 구독
    // 감지: 새 메시지가 chat_messages 테이블에 INSERT될 때
    const messageSubscription = supabase
      .channel(messageChannel)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        async (payload) => {
          const newMessage = payload.new;
          const roomId = newMessage.room_id;

          if (newMessage.sender_id === userId) return;
          if (isInChatRoomRef.current) return;

          try {
            const { data: room } = await supabase
              .from("chat_rooms")
              .select(
                `
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
              `,
              )
              .eq("id", roomId)
              .single();

            // 채팅방이 없거나 매칭이 완료되지 않으면 무시
            if (!room || room.matches.status !== "matched") return;

            // 권한 확인: 이 사용자가 해당 채팅방에 참여 중인가?
            const authorId = room.posts.author_id;
            const matchedRunnerId = room.matches.matched_runner_id;

            if (authorId !== userId && matchedRunnerId !== userId) return;

            // 상대방 프로필 정보 가져오기
            const isAuthor = authorId === userId;
            const { data: opponent } = await supabase
              .from("profiles")
              .select("id, nickname, runner_type, profile_image_url")
              .eq("id", isAuthor ? matchedRunnerId : authorId)
              .single();

            if (!opponent) return;

            // 현재 리스트에 이 채팅방이 있는지 확인
            const targetItem = chatItemsRef.current.find(
              (item) => item.roomId === roomId,
            );

            if (targetItem) {
              // 기존 채팅방: 마지막 메시지 업데이트 (모든 페이지에서 가능)
              updateChatItem(targetItem.matchedId, {
                lastMessage: newMessage.body,
                lastMessageTime: newMessage.created_at,
              });
            }

            // 항상 토스트 표시 (모든 상황에서 사용자에게 알림)
            showToast(`${opponent.nickname}님: ${newMessage.body}`);
          } catch (error) {
            console.error("메시지 처리 중 오류:", error);
          }
        },
      )
      .subscribe((status) => {
        console.log(`메시지 구독 상태: ${status}`);
      });

    // ----------------------------------------------------------------
    // 5-2. 새 채팅방 생성 구독
    // 감지: 새 채팅방이 chat_rooms 테이블에 INSERT될 때
    const roomSubscription = supabase
      .channel(roomChannel)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_rooms" },
        async (payload) => {
          const newRoom = payload.new;
          const roomId = newRoom.id;

          try {
            // 새 채팅방 정보 조회
            const { data: room } = await supabase
              .from("chat_rooms")
              .select(
                `
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
              `,
              )
              .eq("id", roomId)
              .single();

            // 채팅방이 없거나 매칭이 완료되지 않으면 무시
            if (!room || room.matches.status !== "matched") return;

            // 중복 확인: 이미 리스트에 있으면 토스트만 띄우고 return
            // (예: 페이지 1에 있는데 새 채팅방이 초기데이터에 이미 포함된 경우)
            if (chatItemsRef.current.some((item) => item.roomId === room.id)) {
              console.log("이미 목록에 있는 채팅방입니다:", room.id);
              return;
            }

            // 권한 확인: 이 사용자가 해당 채팅방에 참여 중인가?
            const authorId = room.posts.author_id;
            const matchedRunnerId = room.matches.matched_runner_id;

            if (authorId !== userId && matchedRunnerId !== userId) return;

            // 상대방 프로필 정보 가져오기
            const isAuthor = authorId === userId;
            const { data: opponent } = await supabase
              .from("profiles")
              .select("id, nickname, runner_type, profile_image_url")
              .eq("id", isAuthor ? matchedRunnerId : authorId)
              .single();

            if (!opponent) return;

            // 최신 메시지 확인 (있으면 메시지 내용, 없으면 안내문)
            const { data: recentMessage } = await supabase
              .from("chat_messages")
              .select("body, sender_id, created_at")
              .eq("room_id", newRoom.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            // 토스트 표시 (절대 리스트에 추가하지 않음)
            // 사용자가 새로고침할 때 페이지 1에서 새 채팅방을 보게 됨
            if (recentMessage && recentMessage.sender_id !== userId) {
              showToast(`${opponent.nickname}님: ${recentMessage.body}`);
            } else {
              showToast(
                `${opponent.nickname}님과의 새로운 채팅방이 있습니다. 새로고침해 주세요.`,
              );
            }
          } catch (error) {
            console.error("채팅방 생성 처리 중 오류:", error);
          }
        },
      )
      .subscribe((status) => {
        console.log(`채팅방 구독 상태: ${status}`);
      });

    // 컴포넌트 언마운트 시 구독 정리
    return () => {
      messageSubscription.unsubscribe();
      roomSubscription.unsubscribe();
    };
  }, [userId, updateChatItem, showToast]);

  return null;
}
