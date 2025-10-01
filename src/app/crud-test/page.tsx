"use client";

import { useState } from "react";
import supabase from "@/libs/supabase";

export default function CrudTest() {
  const [result, setResult] = useState<string>("");
  const buttonClass = "px-5 py-2 border border-white cursor-pointer";

  const log = (data: any, error: any) =>
    setResult(JSON.stringify({ data, error }, null, 2));

  interface UserInputValue {
    email: string;
    password: string;
    nickname: string;
    runnerType: string;
  }

  const userInputValue: UserInputValue = {
    email: "dduk2684@naver.com",
    password: "wh13467913",
    nickname: "잔디",
    runnerType: "guide_runner",
  };

  // ✅ AUTH
  const signUp = (userInputValue: UserInputValue) => async () => {
    console.log(userInputValue);
    const { data, error } = await supabase.auth.signUp({
      email: userInputValue.email,
      password: userInputValue.password,
      options: {
        data: {
          nickname: userInputValue.nickname,
          runner_type: userInputValue.runnerType,
        },
      },
    });

    log(data, error);
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "950823cjw@gmail.com",
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
      nickname: "잔디",
      runner_type: "guide_runner",
      is_verified: false,
    });
    log(data, error);
  };

  const readProfiles = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id);
    log(data, error);
  };

  const updateProfile = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    const { data, error } = await supabase
      .from("profiles")
      .update({ nickname: "잔디" })
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
      post_id: "7e27ee63-bcd2-4b11-9585-11e76c7d2747",
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
      room_id: "313bf9a6-f6c2-4f2a-b18b-19636fa87ed8",
      sender_id: user.id,
      body: "ㅎㅇ",
    });
    log(data, error);
  };

  const readChatMessages = async () => {
    // ⚠️ 실제 존재하는 room_id로 바꿔야 함
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("room_id", "313bf9a6-f6c2-4f2a-b18b-19636fa87ed8");
    log(data, error);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CRUD Test Page</h1>

      <h2>Auth</h2>
      <button
        type="button"
        className={buttonClass}
        onClick={signUp(userInputValue)}
      >
        Sign Up
      </button>
      <button type="button" className={buttonClass} onClick={signIn}>
        Sign In
      </button>
      <button type="button" className={buttonClass} onClick={signOut}>
        Sign Out
      </button>
      <button type="button" className={buttonClass} onClick={getUser}>
        Get Current User
      </button>

      <h2>Profiles</h2>
      <button type="button" className={buttonClass} onClick={createProfile}>
        Create Profile
      </button>
      <button type="button" className={buttonClass} onClick={readProfiles}>
        Read Profiles
      </button>
      <button type="button" className={buttonClass} onClick={updateProfile}>
        Update Profile
      </button>

      <h2>Posts</h2>
      <button type="button" className={buttonClass} onClick={createPost}>
        Create Post
      </button>
      <button type="button" className={buttonClass} onClick={readPosts}>
        Read Posts
      </button>

      <h2>Matches</h2>
      <button type="button" className={buttonClass} onClick={createMatch}>
        Create Match
      </button>
      <button type="button" className={buttonClass} onClick={readMatches}>
        Read Matches
      </button>

      <h2>Chat Rooms</h2>
      <button type="button" className={buttonClass} onClick={readChatRooms}>
        Read Chat Rooms
      </button>

      <h2>Chat Messages</h2>
      <button type="button" className={buttonClass} onClick={createChatMessage}>
        Create Chat Message
      </button>
      <button type="button" className={buttonClass} onClick={readChatMessages}>
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
