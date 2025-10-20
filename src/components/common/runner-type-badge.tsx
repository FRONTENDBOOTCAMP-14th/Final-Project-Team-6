import tw from "@/utils/tw";

interface RunnerTypeBadgeProps {
  runnerType: "blind_runner" | "guide_runner";
  className?: string;
}

export default function RunnerTypeBadge({
  runnerType,
  className,
}: RunnerTypeBadgeProps) {
  const runnerTypeText =
    runnerType === "blind_runner" ? "시각장애인" : "가이드러너";

  const runnerTypeStyle =
    runnerType === "blind_runner"
      ? "bg-site-yellow text-site-black"
      : "bg-site-blue text-site-white";

  const baseStyle =
    "rounded-sm px-1.5 py-[0.1875rem] text-[0.625rem] font-semibold";

  return (
    <span className={tw(baseStyle, runnerTypeStyle, className)}>
      {runnerTypeText}
    </span>
  );
}
