import type { Metadata } from "next";

export const PAGE_METADATA = {
  // 홈 (포스트 리스트)
  HOME: {
    title: "빛나는 동반주자 연결고리",
    description:
      "시각장애인 러너와 가이드러너를 연결하는 플랫폼, 눈길. 함께 달릴 동반주자를 찾아보세요.",
  },

  // 포스트 상세
  POST_DETAIL: {
    title: "러닝 매칭 상세",
    description:
      "러닝 매칭 글의 세부 정보를 확인하고 러너에게 매칭을 신청하세요.",
  },

  // 포스트 작성
  POST_WRITE: {
    title: "러닝 매칭 글 작성",
    description:
      "러너를 찾기 위한 러닝 매칭 글을 작성해보세요. 함께 달릴 러너를 모집해보세요.",
  },

  // 게시글 편집
  POST_EDIT: {
    title: "게시글 편집",
    description: "작성한 러닝 매칭 글을 수정하고 저장하세요.",
  },

  // 채팅 리스트
  CHAT_LIST: {
    title: "채팅 목록",
    description:
      "매칭된 러너와의 채팅 목록을 확인하고 러닝 일정을 함께 조율하세요",
  },

  // 채팅 상세
  CHAT_DETAIL: {
    title: "채팅",
    description: "러너와 실시간 채팅으로 러닝 일정과 세부사항을 조율하세요.",
  },

  // 로그인
  LOGIN: {
    title: "로그인",
    description:
      "눈길에 로그인하고 시각장애인 러너와 가이드러너 매칭 서비스를 이용하세요.",
  },

  // 회원가입
  SIGNUP: {
    title: "회원가입",
    description:
      "눈길에 가입하고 시각장애인 러너와 가이드러너 매칭 서비스를 시작하세요.",
  },

  // 회원가입 완료
  SIGNUP_COMPLETE: {
    title: "회원가입 완료",
    description:
      "회원가입이 완료되었습니다. 눈길 서비스 이용을 위해 이메일 인증을 완료해주세요.",
  },

  // 프로필
  PROFILE: {
    title: "내 프로필",
    description: "내 프로필과 러닝 기록을 한눈에 확인하세요.",
  },

  // 프로필 편집
  PROFILE_EDIT: {
    title: "프로필 편집",
    description: "내 프로필 정보를 수정하고 저장하세요.",
  },

  // 개인정보처리방침
  PRIVACY: {
    title: "개인정보처리방침",
    description: "눈길 서비스의 개인정보처리방침을 확인하세요.",
  },

  // 이용약관
  TERMS: {
    title: "이용약관",
    description: "눈길 서비스의 이용약관을 확인하세요.",
  },
} as const;

// 공통 메타데이터 생성 함수
export const createMetadata = (page: keyof typeof PAGE_METADATA): Metadata => ({
  title: PAGE_METADATA[page].title,
  description: PAGE_METADATA[page].description,
  keywords:
    "가이드러너, 시각장애인, 러닝, 매칭, 동반주자, 시각장애인러너, 눈길",
  openGraph: {
    title: PAGE_METADATA[page].title,
    description: PAGE_METADATA[page].description,
    type: "website",
    siteName: "눈길",
    locale: "ko_KR",
    images: [
      {
        url: "https://eyepath.vercel.app/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "눈길 서비스 미리보기 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_METADATA[page].title,
    description: PAGE_METADATA[page].description,
    images: ["https://eyepath.vercel.app/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://eyepath.vercel.app",
  },
});
