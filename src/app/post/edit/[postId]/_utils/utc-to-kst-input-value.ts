export default function utcToKSTInputValue(utcString: string) {
  const date = new Date(utcString);

  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  );

  return offsetDate.toISOString().slice(0, 16);
}
