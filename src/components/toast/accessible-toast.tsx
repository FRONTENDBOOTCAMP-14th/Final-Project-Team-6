"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useToastStore } from "@/stores/toast-store";
import { tw } from "@/utils";

/**
 * AccessibleToast 컴포넌트
 *
 * - SSR 안전하게 Portal 렌더링
 * - role="status"로 시각/스크린리더 통합
 * - 페이드인/아웃 자연스럽게 처리
 */
export default function AccessibleToast() {
  const { message, isVisible } = useToastStore();
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // 클라이언트에서만 Portal 렌더 허용
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  // 페이드아웃 전환 후 언마운트 (500ms)
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // SSR 단계에서는 렌더하지 않음
  if (!mounted || !shouldRender) return null;

  return createPortal(
    <output
      aria-live="polite"
      className={tw(
        "fixed bottom-5 left-1/2 -translate-x-1/2 bg-site-lightblack text-site-white",
        "px-4 py-2 rounded-md shadow-md text-sm transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      {message}
    </output>,
    document.body,
  );
}
