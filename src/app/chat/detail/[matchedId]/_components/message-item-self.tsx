import Message from "./message";

interface Props {
  body: string;
  sendedDate: string;
}

export default function MessageItemSelf({ body, sendedDate }: Props) {
  return (
    <li>
      <h2 className="sr-only">내가 보낸 메세지</h2>
      <div className="flex flex-row justify-end gap-2">
        <Message body={body} sendedDate={sendedDate} />
      </div>
    </li>
  );
}
