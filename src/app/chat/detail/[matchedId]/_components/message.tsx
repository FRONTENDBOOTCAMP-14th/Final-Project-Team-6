import { tw } from "@/utils";

interface Props {
  body: string;
  sendedDate: string;
  sender?: boolean;
}

export default function Message({ body, sendedDate, sender }: Props) {
  return (
    <>
      <span
        className={tw(
          "bg-site-lightblack max-w-9/12 rounded-2xl px-4 py-2",
          "leading-normal text-sm break-words",
          `${sender ? "rounded-tl-none " : "rounded-tr-none order-1"}`,
        )}
      >
        {body}
      </span>
      <time className="text-xs text-site-gray content-end pb-1 text-right">
        {sendedDate}
      </time>
    </>
  );
}
