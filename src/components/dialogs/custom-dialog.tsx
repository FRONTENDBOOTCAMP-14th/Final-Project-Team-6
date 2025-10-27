"use client";

import { useDialog } from "@/stores/use-dialog";

export default function CustomDialog() {
  const { content } = useDialog();
  return <>{content}</>;
}
