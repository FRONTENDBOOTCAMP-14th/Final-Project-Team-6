export default function formatChatTime(time: string) {
  const now = new Date();
  const messageTime = new Date(time);
  const diffInMinutes = Math.floor(
    (now.getTime() - messageTime.getTime()) / 60000,
  );

  if (diffInMinutes < 1) {
    return "방금 전";
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
}
