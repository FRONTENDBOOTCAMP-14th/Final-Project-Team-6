"use client";

import { useState } from "react";
import supabase from "@/libs/supabase";

export default function CrudTest() {
  const [result, setResult] = useState<string>("");

  const log = (data: any, error: any) =>
    setResult(JSON.stringify({ data, error }, null, 2));

  // ✅ AUTH
  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: "peacheese17@naver.com",
      password: "password123",
    });
    log(data, error);
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "peacheese17@naver.com",
      password: "password123",
    });
    log(data, error);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    log("로그아웃", error);
  };

  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    log(data, error);
  };

  // ✅ PROFILES
  const createProfile = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    const { data, error } = await supabase.from("profiles").insert({
      id: user.id,
      nickname: "테스트닉네임",
      runner_type: "guide_runner",
      is_verified: false,
    });
    log(data, error);
  };

  const readProfiles = async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    log(data, error);
  };

  const updateProfile = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    const { data, error } = await supabase
      .from("profiles")
      .update({ nickname: "다시닉네임수정" })
      .eq("id", user.id);
    log(data, error);
  };

  // ✅ POSTS
  const createPost = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    const { data, error } = await supabase.from("posts").insert({
      author_id: user.id,
      title: "테스트 글",
      description: "러닝 같이 하실 분?",
      meeting_place: "울산대 운동장",
      meeting_detail_place: "정문 앞",
      meeting_time: new Date().toISOString(),
      goal_km: 5,
      pace: 8,
      status: "open",
    });
    log(data, error);
  };

  const readPosts = async () => {
    const { data, error } = await supabase.from("posts").select("*");
    log(data, error);
  };

  // ✅ MATCHES (매칭 → chat_rooms 자동 생성됨)
  const createMatch = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    // ⚠️ 실제 존재하는 post_id로 바꿔야 함
    const { data, error } = await supabase.from("matches").insert({
      post_id: "실제-게시글-uuid-여기에",
      matched_runner_id: user.id,
      status: "matched",
      message: "안녕하세요, 동행하고 싶습니다!",
    });
    log(data, error);
  };

  const readMatches = async () => {
    const { data, error } = await supabase.from("matches").select("*");
    log(data, error);
  };

  // ✅ CHAT ROOMS (트리거로 자동 생성됨)
  const readChatRooms = async () => {
    const { data, error } = await supabase.from("chat_rooms").select("*");
    log(data, error);
  };

  // ✅ CHAT MESSAGES
  const createChatMessage = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    // ⚠️ 실제 존재하는 room_id로 바꿔야 함
    const { data, error } = await supabase.from("chat_messages").insert({
      room_id: "실제-채팅방-uuid-여기에",
      sender_id: user.id,
      body: "안녕하세요, 첫 채팅입니다!",
    });
    log(data, error);
  };

  const readChatMessages = async () => {
    // ⚠️ 실제 존재하는 room_id로 바꿔야 함
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("room_id", "실제-채팅방-uuid-여기에");
    log(data, error);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CRUD Test Page</h1>

      <h2>Auth</h2>
      <button type="button" onClick={signUp}>
        Sign Up
      </button>
      <button type="button" onClick={signIn}>
        Sign In
      </button>
      <button type="button" onClick={signOut}>
        Sign Out
      </button>
      <button type="button" onClick={getUser}>
        Get Current User
      </button>

      <h2>Profiles</h2>
      <button type="button" onClick={createProfile}>
        Create Profile
      </button>
      <button type="button" onClick={readProfiles}>
        Read Profiles
      </button>
      <button type="button" onClick={updateProfile}>
        Update Profile
      </button>

      <h2>Posts</h2>
      <button type="button" onClick={createPost}>
        Create Post
      </button>
      <button type="button" onClick={readPosts}>
        Read Posts
      </button>

      <h2>Matches</h2>
      <button type="button" onClick={createMatch}>
        Create Match
      </button>
      <button type="button" onClick={readMatches}>
        Read Matches
      </button>

      <h2>Chat Rooms</h2>
      <button type="button" onClick={readChatRooms}>
        Read Chat Rooms
      </button>

      <h2>Chat Messages</h2>
      <button type="button" onClick={createChatMessage}>
        Create Chat Message
      </button>
      <button type="button" onClick={readChatMessages}>
        Read Chat Messages
      </button>

      <h2>Result</h2>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "8px",
          maxHeight: "300px",
          overflow: "auto",
          color: "#333",
        }}
      >
        {result}
      </pre>
    </div>
  );
}
