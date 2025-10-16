import { IconArrowLeft, IconArrowRight } from "@/components/common/icons";
import siteHexColor from "@/constant/site-hex-color";
import tw from "@/utils/tw";
import { Button } from "../common";

type PaginationButtonProps = {
  direction: "prev" | "next";
  className: string;
  onClick: () => void;
};

export default function PaginationButton({
  direction,
  className,
  onClick,
  ...restProps
}: PaginationButtonProps) {
  const Icon = direction === "prev" ? IconArrowLeft : IconArrowRight;
  const label = direction === "prev" ? "이전 페이지" : "다음 페이지";

  return (
    <Button
      type="button"
      buttonColor={siteHexColor.lightblack}
      className={tw("p-2", className)}
      aria-label={label}
      onClick={onClick}
      {...restProps}
    >
      <Icon />
    </Button>
  );
}
