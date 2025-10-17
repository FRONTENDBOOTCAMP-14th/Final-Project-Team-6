export default function formatChatTime(kstDate: Date) {
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const messageTime = new Date(kstDate);
  const diffInMinutes = Math.floor(
    (kstNow.getTime() - messageTime.getTime()) / 60000,
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
