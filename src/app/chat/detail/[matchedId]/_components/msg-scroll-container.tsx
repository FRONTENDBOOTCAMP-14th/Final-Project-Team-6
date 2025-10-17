"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
}

export default function MsgScrollContainer({ children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <div className="fixed top-[150px] overflow-y-auto h-[calc(100vh-222px)] w-full max-w-(--viewport-size) left-1/2 -translate-x-1/2 px-5 custom-scrollbar">
      {children}
    </div>
  );
}
