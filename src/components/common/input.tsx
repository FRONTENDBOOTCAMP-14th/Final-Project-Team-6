// 인풋 컴포넌트에선 :focus 같은 CSS 상태를 useState 없이 간결하게 관리하기 위해 className(global.css)사용했습니다.
import { type InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  suffixButton?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  suffixText?: string;
  className?: string;
}

export default function Input({
  label,
  isError,
  errorMessage,
  suffixButton,
  suffixIcon,
  suffixText,
  className,
  ...props
}: InputProps) {
  const id = useId();

  const borderColor = isError
    ? "border-[var(--color-site-red)]"
    : "border-[var(--color-site-gray)] focus:border-[var(--color-site-white)]";

  const labelColor = isError
    ? "text-[var(--color-site-red)]"
    : "text-[var(--color-site-gray)]";
  // 인풋태그의 내용물이 텍스트 길이에 따라 버튼, 아이콘, 텍스트에 가려지는 것을 방지하기 위해
  // 버튼이 들어오면 104px, 아이콘이나 텍스트가 들어오면 50px만큼 우측패딩을 확보합니다.
  // 이 부분을 동적으로 처리하려면 복잡해져서 하드코딩으로 처리했습니다.
  let paddingClass = "px-[20px]";

  if (suffixButton) {
    paddingClass = "pl-[20px] pr-[104px]";
  } else if (suffixIcon || suffixText) {
    paddingClass = "pl-[20px] pr-[50px]";
  }
  // 인풋태그 길이( == 뷰포트 가로길이)와 무관하게
  // 인풋태그 우측테두리 기준 버튼위치는 6px, 아이콘과 텍스트는 20px 떨어진 곳에 위치합니다.
  const suffixPositionClass = suffixButton ? "right-[6px]" : "right-[20px]";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-2 ${labelColor}`}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          className={`h-[52px] focus:outline-none w-full bg-transparent border rounded-md p-[12px] text-[var(--color-site-white)] ${borderColor} ${paddingClass} ${className}`}
          {...props}
        />
        <div className={`absolute  flex items-center ${suffixPositionClass}`}>
          {suffixButton}
          {suffixIcon}
          {suffixText && (
            <span className="text-sm text-[var(--color-site-gray)]">
              {suffixText}
            </span>
          )}
        </div>
      </div>
      {isError && errorMessage && (
        <p className="text-[var(--color-site-red)] text-xs mt-[4px]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
