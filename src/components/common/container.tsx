import type React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={`w-full min-w-[320px] max-w-[480px] mx-auto ${className || ""}`}
    >
      {children}
    </div>
  );
}
