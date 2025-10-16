import type { Match, PostWithAuthor, RunnerType } from "@/app/post/type";
import { Button } from "@/components/common";

// 뷰 컴포넌트의 Props 타입을 명확하게 정의
interface MatchedAuthorViewProps {
  actions: {
    complete: () => void;
    cancel: () => void;
    delete: (formData: FormData) => void;
  };
}

interface MatchedApplicantViewProps {
  actions: {
    complete: () => void;
    cancel: () => void;
  };
}

interface UnmatchedAuthorViewProps {
  actions: {
    delete: (formData: FormData) => void;
  };
}

interface DefaultViewProps {
  actions: {
    createMatch: () => void;
  };
}

// 메인 컴포넌트 Props 타입
interface ActionButtonsProps {
  post: PostWithAuthor;
  match: Match | null;
  isAuthor: boolean;
  isApplicant: boolean;
  currentUserRunnerType?: RunnerType | null;
  actions: {
    completePost: (postId: string) => void;
    createMatchAndChat: (params: { postId: string; authorId: string }) => void;
    deletePost: (formData: FormData) => void; // FormData를 받는 타입
    cancelMatch: (matchId: string, postId: string) => void;
  };
}

// 메인 ActionButtons 컴포넌트
export default function ActionButtons({
  post,
  match,
  isAuthor,
  isApplicant,
  currentUserRunnerType,
  actions,
}: ActionButtonsProps) {
  const isMatched = !!match;
  const isCompleted = post.is_completed;
  const authorRunnerType = post.author?.runner_type;

  const completeAction = actions.completePost.bind(null, post.id);
  const createMatchAction = actions.createMatchAndChat.bind(null, {
    postId: post.id,
    authorId: post.author_id,
  });
  const cancelAction = match
    ? actions.cancelMatch.bind(null, match.id, post.id)
    : () => {};

  if (isCompleted) {
    return <CompletedView />;
  }

  if (isMatched) {
    if (isAuthor)
      return (
        <MatchedAuthorView
          post={post}
          actions={{
            complete: completeAction,
            cancel: cancelAction,
            delete: actions.deletePost,
          }}
        />
      );
    if (isApplicant)
      return (
        <MatchedApplicantView
          actions={{ complete: completeAction, cancel: cancelAction }}
        />
      );
    return <AlreadyMatchedView />;
  }

  if (isAuthor) {
    return (
      <UnmatchedAuthorView
        post={post}
        actions={{ delete: actions.deletePost }}
      />
    );
  }

  if (currentUserRunnerType && currentUserRunnerType === authorRunnerType) {
    return <SameTypeRunnerView />;
  }

  return <DefaultView actions={{ createMatch: createMatchAction }} />;
}

// 각 상태별 뷰 컴포넌트들

function CompletedView() {
  return (
    <Button disabled fullWidth>
      러닝 완료
    </Button>
  );
}

function MatchedAuthorView({
  post,
  actions,
}: { post: PostWithAuthor } & MatchedAuthorViewProps) {
  return (
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
          <input type="hidden" name="postId" value={post.id} />
          <Button type="submit" buttonColor="var(--color-site-red)">
            삭제
          </Button>
        </form>
      </div>
    </div>
  );
}

function MatchedApplicantView({ actions }: MatchedApplicantViewProps) {
  return (
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
}

function AlreadyMatchedView() {
  return (
    <Button disabled fullWidth>
      매칭 완료
    </Button>
  );
}

function UnmatchedAuthorView({
  post,
  actions,
}: { post: PostWithAuthor } & UnmatchedAuthorViewProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button disabled fullWidth>
        매칭을 기다리는 중...
      </Button>
      <div className="flex justify-end gap-2">
        <Button buttonColor="var(--color-site-lightblack)">편집</Button>
        <form action={actions.delete}>
          <input type="hidden" name="postId" value={post.id} />
          <Button type="submit" buttonColor="var(--color-site-red)">
            삭제
          </Button>
        </form>
      </div>
    </div>
  );
}

function SameTypeRunnerView() {
  return (
    <Button disabled fullWidth buttonColor="var(--color-site-lightblack)">
      같은 타입의 러너와는 매칭할 수 없습니다
    </Button>
  );
}

function DefaultView({ actions }: DefaultViewProps) {
  return (
    <form action={actions.createMatch}>
      <Button type="submit" buttonColor="var(--color-site-blue)" fullWidth>
        매칭 신청하기
      </Button>
    </form>
  );
}
