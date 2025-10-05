import type { ButtonHTMLAttributes, ReactNode } from "react";
import { siteHexColor } from "@/constructor/";
import { tw } from "@/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonColor?: string;
  textColor?: string;
  height?: "small" | "medium";
  children: string | ReactNode;
  fill?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  type,
  buttonColor = siteHexColor.blue,
  textColor = siteHexColor.white,
  height = "small",
  children,
  fill = true,
  fullWidth = false,
  disabled,
  className,
  ...restProps
}: Props) {
  const heightValue = {
    small: "40px",
    medium: "52px",
  };

  return (
    <button
      type={type}
      className={tw(
        "flex gap-1 px-4 items-center rounded-sm font-semibold ",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        fullWidth && "w-full justify-center",
        className,
      )}
      style={
        fill
          ? {
              color: textColor,
              backgroundColor: buttonColor,
              height: heightValue[height],
            }
          : {
              color: buttonColor,
              border: `1px solid ${buttonColor}`,
              height: heightValue[height],
            }
      }
      {...restProps}
    >
      {children}
    </button>
  );
}
