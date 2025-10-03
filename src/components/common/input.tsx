import { type InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  suffixButton?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export default function Input({
  label,
  isError,
  errorMessage,
  suffixButton,
  suffixIcon,
  ...props
}: InputProps) {
  const id = useId();

  const borderColor = isError
    ? "border-red-500"
    : "border-gray-500 focus:border-white";

  const labelColor = isError ? "text-red-500" : "text-gray-300";
  const paddingClass = suffixButton ? "pl-5 pr-[3px]" : "px-5";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-1 ${labelColor}`}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          className={`focus:outline-none w-full bg-transparent border rounded-md p-3 text-white ${borderColor} ${paddingClass}`}
          {...props}
        />
        <div className="absolute right-2 flex items-center">
          {suffixButton}
          {suffixIcon}
        </div>
      </div>
      {isError && errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
