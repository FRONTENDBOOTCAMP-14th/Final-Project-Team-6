/**
 * UTC 시간을 한국 시간(KST, UTC+9)으로 변환 후 "yy.MM.dd HH:mm" 형식으로 반환
 * @param utcDate UTC 날짜 문자열 또는 Date 객체
 * @returns 변환된 한국 시간 문자열
 */
export default function formatUTCtoKST(utcDate: string | Date): string {
  const date = typeof utcDate === "string" ? new Date(utcDate) : utcDate;

  // UTC 기준으로 년, 월, 일, 시, 분 가져오기
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // 0~11
  const day = date.getUTCDate();
  const hours = date.getUTCHours() + 9; // KST = UTC + 9
  const minutes = date.getUTCMinutes();

  // 시간 24시간 넘어가면 날짜 조정
  let adjustedYear = year;
  let adjustedMonth = month;
  let adjustedDay = day;
  let adjustedHours = hours;

  if (adjustedHours >= 24) {
    adjustedHours -= 24;
    adjustedDay += 1;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (adjustedDay > daysInMonth) {
      adjustedDay = 1;
      adjustedMonth += 1;
      if (adjustedMonth > 12) {
        adjustedMonth = 1;
        adjustedYear += 1;
      }
    }
  }

  const yy = adjustedYear.toString().slice(2);
  const MM = String(adjustedMonth).padStart(2, "0");
  const dd = String(adjustedDay).padStart(2, "0");
  const HH = String(adjustedHours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  return `${yy}.${MM}.${dd} ${HH}:${mm}`;
}
