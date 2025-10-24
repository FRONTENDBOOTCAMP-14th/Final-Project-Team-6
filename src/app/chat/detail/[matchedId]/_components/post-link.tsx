import { Link } from "@/components/common";
import { formatUTCtoKST } from "@/utils";
import type { RoomPost } from "../_actions/type";

interface Props {
  postData: RoomPost;
}

export default function PostLink({ postData }: Props) {
  return (
    <Link
      href={`/post/detail/${postData.id}`}
      aria-label="채팅방과 연결된 게시물 이동"
      className="h-20 flex flex-wrap flex-row items-center fixed top-[70px] bg-site-lightblack left-1/2 -translate-x-1/2 w-full max-w-(--viewport-size) px-5"
    >
      <span className="w-full">
        <strong className="mb-2 block overflow-hidden text-ellipsis whitespace-nowrap w-full">
          {postData.title}
        </strong>
        <span className="flex gap-3 text-xs text-site-gray">
          <span>러닝 시작일 | {formatUTCtoKST(postData.meeting_time)}</span>
          <span>
            <span className="sr-only">러닝 시작 위치</span>
            <em aria-hidden="true">#</em> {postData.meeting_place}
          </span>
          <span>
            <span className="sr-only">러닝 거리</span>
            <em aria-hidden="true">#</em> {postData.goal_km}km
          </span>
        </span>
      </span>
    </Link>
  );
}
