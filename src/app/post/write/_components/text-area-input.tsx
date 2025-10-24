import type React from "react";

interface TextAreaInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  required?: boolean;
  id?: string;
}

export default function TextAreaInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  maxLength = 500,
  rows = 5,
  required = false,
  id,
}: TextAreaInputProps) {
  const inputId = id || name;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium mb-2 text-[var(--color-site-gray)]"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="focus:outline-none w-full bg-transparent border border-[var(--color-site-gray)] focus:border-[var(--color-site-white)] rounded-md p-[12px] text-[var(--color-site-gray)] resize-none"
        maxLength={maxLength}
        value={value}
        onChange={onChange}
      />
      {maxLength && (
        <div className="text-right text-sm text-gray-500">
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  );
}
