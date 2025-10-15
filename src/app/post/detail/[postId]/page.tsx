import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/common";
import formatUTCtoKST from "@/utils/fomat-utc-to-kst";
import { createClient } from "@/utils/supabase/server";
import {
  cancelMatch,
  completePost,
  createMatchAndChat,
  deletePost,
} from "./action";

// --- 데이터 가져오는 함수들 ---

async function getPostById(id: string) {
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select(`*, author:profiles(id, nickname, runner_type, profile_image_url)`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("[Server] getPostById DB Error:", error.message);
  }

  return post;
}

async function getMatchForPost(postId: string) {
  const supabase = await createClient();
  const { data: match } = await supabase
    .from("matches")
    .select("*, applicant:profiles(*)")
    .eq("post_id", postId)
    .neq("status", "cancelled")
    .maybeSingle();
  return match;
}

async function getCurrentUserProfile(userId: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("runner_type")
    .eq("id", userId)
    .single();
  return profile;
}

// --- 메인 페이지 컴포넌트 ---
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const [post, match] = await Promise.all([
    getPostById(postId),
    getMatchForPost(postId),
  ]);

  const currentUserProfile = authUser
    ? await getCurrentUserProfile(authUser.id)
    : null;

  if (!post) {
    notFound();
  }

  const isAuthor = authUser?.id === post.author_id;
  const isApplicant = authUser?.id === match?.matched_runner_id;
  const isMatched = !!match;
  const isCompleted = post.is_completed;

  const completePostAction = completePost.bind(null, post.id);
  const createMatchAction = createMatchAndChat.bind(null, {
    postId: post.id,
    authorId: post.author_id,
  });
  const deletePostAction = deletePost.bind(null, post.id);
  const cancelMatchAction = match
    ? cancelMatch.bind(null, match.id, post.id)
    : () => {};

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* 작성자 프로필 */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 overflow-hidden rounded-full">
          <Image
            src="/assets/default-profile.png"
            alt={`${post.author?.nickname}님의 프로필 사진`}
            fill
            className="object-cover bg-[var(--color-site-lightblack)]"
            sizes="48px"
          />
        </div>
        <div>
          <p className="font-bold text-[var(--color-site-white)]">
            {post.author?.nickname}
          </p>
          <p className="text-sm text-[var(--color-site-gray)]">
            {post.author?.runner_type === "guide_runner"
              ? "가이드러너"
              : "시각장애인 러너"}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold">{post.title}</h2>
      <div className="w-full aspect-video bg-[var(--color-site-lightblack)] rounded-lg flex items-center justify-center">
        <p className="text-[var(--color-site-gray)]">지도 영역</p>
      </div>
      <div className="flex flex-col gap-4 text-sm">
        <InfoItem label="러닝 희망 장소" value={post.meeting_place} />
        <InfoItem
          label="러닝 시작 시간"
          value={formatUTCtoKST(post.meeting_time)}
        />
        <InfoItem label="목표 거리" value={`${post.goal_km}km`} />
        <InfoItem label="목표 페이스" value={`${post.pace}분/km`} />
      </div>
      <p className="text-base leading-relaxed text-[var(--color-site-gray)]">
        {post.description}
      </p>

      <ActionButtons
        isAuthor={isAuthor}
        isApplicant={isApplicant}
        isMatched={isMatched}
        isCompleted={isCompleted}
        currentUserRunnerType={
          currentUserProfile?.runner_type as "guide_runner" | "blind_runner"
        }
        authorRunnerType={
          post.author?.runner_type as "guide_runner" | "blind_runner"
        }
        actions={{
          complete: completePostAction,
          createMatch: createMatchAction,
          delete: deletePostAction,
          cancel: cancelMatchAction,
        }}
      />
    </div>
  );
}

// --- ActionButtons 컴포넌트 Props 타입 정의 ---
type RunnerType = "guide_runner" | "blind_runner";

interface ActionButtonsProps {
  isAuthor: boolean;
  isApplicant: boolean;
  isMatched: boolean;
  isCompleted: boolean;
  currentUserRunnerType?: RunnerType | null;
  authorRunnerType?: RunnerType | null;
  actions: {
    complete: () => void;
    createMatch: () => void;
    delete: () => void;
    cancel: () => void;
  };
}

// --- [수정됨] ActionButtons 컴포넌트 리팩터링 ---
function ActionButtons({
  isAuthor,
  isApplicant,
  isMatched,
  isCompleted,
  currentUserRunnerType,
  authorRunnerType,
  actions,
}: ActionButtonsProps) {
  if (isCompleted) {
    return <CompletedView />;
  }

  if (isMatched) {
    if (isAuthor) return <MatchedAuthorView actions={actions} />;
    if (isApplicant) return <MatchedApplicantView actions={actions} />;
    return <AlreadyMatchedView />;
  }

  // 매칭 안 된 상태
  if (isAuthor) {
    return <UnmatchedAuthorView actions={actions} />;
  }

  if (currentUserRunnerType && currentUserRunnerType === authorRunnerType) {
    return <SameTypeRunnerView />;
  }

  return <DefaultView actions={actions} />;
}

// --- 각 상태별 뷰 컴포넌트 ---
type ActionsProp = {
  actions: Pick<
    ActionButtonsProps["actions"],
    "complete" | "cancel" | "delete" | "createMatch"
  >;
};

const CompletedView = () => (
  <Button disabled fullWidth>
    러닝 완료
  </Button>
);

const MatchedAuthorView = ({ actions }: Pick<ActionsProp, "actions">) => (
  <div className="flex flex-col gap-2">
    <form action={actions.complete}>
      <Button type="submit" buttonColor="var(--color-site-blue)" fullWidth>
        러닝 완료
      </Button>
    </form>
    <div className="flex items-center gap-2">
      <form action={actions.cancel}>
        <Button type="submit" buttonColor="var(--color-site-lightblack)">
          매칭취소
        </Button>
      </form>
      <div className="flex-grow" />
      <Button buttonColor="var(--color-site-lightblack)">편집</Button>
      <form action={actions.delete}>
        <Button type="submit" buttonColor="var(--color-site-red)">
          삭제
        </Button>
      </form>
    </div>
  </div>
);

const MatchedApplicantView = ({ actions }: Pick<ActionsProp, "actions">) => (
  <div className="flex flex-col gap-2">
    <form action={actions.complete} className="w-full">
      <Button type="submit" buttonColor="var(--color-site-blue)" fullWidth>
        러닝 완료
      </Button>
    </form>
    <div className="flex">
      <form action={actions.cancel}>
        <Button type="submit" buttonColor="var(--color-site-lightblack)">
          매칭취소
        </Button>
      </form>
    </div>
  </div>
);

const AlreadyMatchedView = () => (
  <Button disabled fullWidth>
    매칭 완료
  </Button>
);

const UnmatchedAuthorView = ({ actions }: Pick<ActionsProp, "actions">) => (
  <div className="flex flex-col gap-2">
    <Button disabled fullWidth>
      매칭을 기다리는 중...
    </Button>
    <div className="flex justify-end gap-2">
      <Button buttonColor="var(--color-site-lightblack)">편집</Button>
      <form action={actions.delete}>
        <Button type="submit" buttonColor="var(--color-site-red)">
          삭제
        </Button>
      </form>
    </div>
  </div>
);

const SameTypeRunnerView = () => (
  <Button disabled fullWidth buttonColor="var(--color-site-lightblack)">
    같은 타입의 러너와는 매칭할 수 없습니다
  </Button>
);

const DefaultView = ({ actions }: Pick<ActionsProp, "actions">) => (
  <form action={actions.createMatch}>
    <Button type="submit" buttonColor="var(--color-site-blue)" fullWidth>
      매칭 신청하기
    </Button>
  </form>
);

// --- 상세 정보 항목을 위한 작은 도우미 컴포넌트 ---
function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[var(--color-site-gray)]">{label}</span>
      <span className="font-semibold text-[var(--color-site-white)]">
        {value}
      </span>
    </div>
  );
}
