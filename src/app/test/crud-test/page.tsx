"use client";

import { useState } from "react";
import supabase from "@/libs/supabase";

/* 닉네임 중복 체크
export const checkNickname = async (nickname: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle(); // 0개 또는 1개 row만

  if (error) {
    console.error("닉네임 중복 확인 실패:", error.message);
    return { exists: false, error };
  }

  if (data) {
    return { exists: true }; // 이미 존재
  }

  return { exists: false }; // 사용 가능
};

const handleCheckNickname = async () => {
  const res = await checkNickname("테스트닉네임");
  if (res.exists) {
    alert("이미 사용 중인 닉네임입니다.");
  } else {
    alert("사용 가능한 닉네임입니다.");
  }
};
*/

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

  // 테스트용 객체
  const userInputValue: UserInputValue = {
    email: "peacheese17@naver.com",
    password: "wldus123",
    nickname: "지연",
    runnerType: "guide_runner",
  };

  // --------------------------------------------------------------
  // AUTH
  const signUp = (userInputValue: UserInputValue) => async () => {
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

    if (error) {
      throw new Error("회원가입 실패");
    } else if (
      // 이메일 중복확인 버튼 없이 검증하는 로직
      data.user &&
      !data.session &&
      data.user.identities?.length === 0
    ) {
      throw new Error("이미 가입된 이메일 주소 입니다.");
    }
  };

  const signIn = (userInputValue: UserInputValue) => async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userInputValue.email,
      password: userInputValue.password,
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

  // --------------------------------------------------------------
  // PROFILES
  // 프로필 생성 (그러나 회원 가입 후 )
  // const createProfile = async () => {
  //   const user = (await supabase.auth.getUser()).data.user;
  //   if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

  //   const { data, error } = await supabase.from("profiles").insert({
  //     id: user.id,
  //     nickname: "잔디",
  //     runner_type: "guide_runner",
  //     is_verified: false,
  //   });
  //   log(data, error);
  // };

  const readMyProfiles = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id);
    log(data, error);
  };

  const readAllProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("nickname, profile_image_url, runner_type");
    log(data, error);
  };

  const updateProfile = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    const { data, error } = await supabase
      .from("profiles")
      .update({
        nickname: "jandi",
        profile_image_url: "template-user-image-01.png",
      })
      .eq("id", user.id);
    log(data, error);
  };

  // --------------------------------------------------------------
  // POSTS
  const createPost = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    const { data, error } = await supabase.from("posts").insert({
      author_id: user.id,
      title: "지연의 러닝 게시글",
      description: "나랑 같이 러닝할래~?",
      meeting_place: "울산",
      meeting_detail_place: "태화강 국가정원",
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

  // --------------------------------------------------------------
  // MATCHES (매칭 → chat_rooms 자동 생성됨)
  const createMatch = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    // ⚠️ 실제 존재하는 post_id로 바꿔야 함
    const { data, error } = await supabase.from("matches").insert({
      post_id: "a7ab448a-0f39-45e9-acfc-6fa9ebf90e72",
      matched_runner_id: user.id,
      status: "matched",
      message: "동동동대문을 열어라~",
    });
    log(data, error);
  };

  const cancelMatch = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    // ⚠️ 실제 존재하는 id로 바꿔야 함(매칭 아이디)
    const { data, error } = await supabase
      .from("matches")
      .update({ status: "cancelled" })
      .eq("id", "55b0d878-b783-4934-908e-34be8447cc78");
    log(data, error);
  };

  const readMatches = async () => {
    const { data, error } = await supabase.from("matches").select("*");
    log(data, error);
  };

  // --------------------------------------------------------------
  // CHAT ROOMS (트리거로 자동 생성됨)
  const readChatRooms = async () => {
    const { data, error } = await supabase.from("chat_rooms").select("*");
    log(data, error);
  };

  // --------------------------------------------------------------
  // CHAT MESSAGES
  const createChatMessage = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return log(null, "사용자가 로그인되어 있지 않습니다.");

    // ⚠️ 실제 존재하는 room_id로 바꿔야 함
    const { data, error } = await supabase.from("chat_messages").insert({
      room_id: "87fe3d3c-4938-4f9a-be08-86290e8530c4",
      sender_id: user.id,
      body: "안녕하세요, 같이 러닝합시당~!",
    });
    log(data, error);
  };

  const readChatMessages = async () => {
    // ⚠️ 실제 존재하는 room_id로 바꿔야 함
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("room_id", "87fe3d3c-4938-4f9a-be08-86290e8530c4");
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
      <button
        type="button"
        className={buttonClass}
        onClick={signIn(userInputValue)}
      >
        Sign In
      </button>
      <button type="button" className={buttonClass} onClick={signOut}>
        Sign Out
      </button>
      <button type="button" className={buttonClass} onClick={getUser}>
        Get Current User
      </button>

      <h2>Profiles</h2>
      {/* <button type="button" className={buttonClass} onClick={createProfile}>
        Create Profile
      </button> */}
      <button type="button" className={buttonClass} onClick={readMyProfiles}>
        Read My Profiles
      </button>
      <button type="button" className={buttonClass} onClick={readAllProfiles}>
        Read All Profiles
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
      <button type="button" className={buttonClass} onClick={cancelMatch}>
        Cancel Match
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
