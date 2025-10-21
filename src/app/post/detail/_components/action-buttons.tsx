import AlreadyMatchedView from "@/app/post/detail/_components/_views/already-matched-view";
import CompletedView from "@/app/post/detail/_components/_views/completed-view";
import DefaultView from "@/app/post/detail/_components/_views/default-view";
import MatchedApplicantView from "@/app/post/detail/_components/_views/matched-applicant-view";
import MatchedAuthorView from "@/app/post/detail/_components/_views/matched-author-view";
import SameTypeRunnerView from "@/app/post/detail/_components/_views/same-type-runner-view";
import UnmatchedAuthorView from "@/app/post/detail/_components/_views/unmatched-author-view";
import type { Match, PostWithAuthor, RunnerType } from "@/app/post/type";

// --- 여기까지 ---

// 메인 컴포넌트 Props 타입
interface ActionButtonsProps {
  post: PostWithAuthor;
  match: Match | null;
  isAuthor: boolean;
  isApplicant: boolean;
  currentUserRunnerType?: RunnerType | null;
  actions: {
    completePost: (postId: string, matchId: string) => void;
    createMatchAndChat: (params: { postId: string; authorId: string }) => void;
    deletePost: (formData: FormData) => void;
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
  const isMatched = post.status === "matched";
  const isCompleted = post.is_completed;
  const authorRunnerType = post.author?.runner_type;

  const createMatchAction = actions.createMatchAndChat.bind(null, {
    postId: post.id,
    authorId: post.author_id,
  });

  if (isCompleted) {
    return <CompletedView />;
  }

  if (isMatched) {
    if (isAuthor || isApplicant) {
      if (!match) {
        console.error(
          "Inconsistent state: post.status is 'matched' but no match object was provided.",
        );
        return <AlreadyMatchedView />;
      }
      const completeAction = actions.completePost.bind(null, post.id, match.id);
      const cancelAction = actions.cancelMatch.bind(null, match.id, post.id);

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
            post={post}
            actions={{ complete: completeAction, cancel: cancelAction }}
          />
        );
    }
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
