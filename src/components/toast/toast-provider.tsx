"use client";

import AccessibleToast from "./accessible-toast";

/**
 * ToastProvider
 *
 * 앱 전체에서 Toast를 표시할 수 있도록 감싸주는 Provider
 */
export default function ToastProvider() {
  return <AccessibleToast />;
}
