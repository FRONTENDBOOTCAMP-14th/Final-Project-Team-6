"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { siteHexColor } from "@/constructor";
import { useDialog } from "@/stores/use-dialog";
import Button from "../common/button";
import IconCheck from "../common/icons/icon-check";
import IconClose from "../common/icons/icon-close";

export default function ConfirmDialog() {
  const { message, onConfirm, closeDialog } = useDialog();

  const handleDialogConfirm = () => {
    onConfirm?.();
    closeDialog();
  };

  return (
    <div>
      <DialogTitle className="text-2xl font-bold mb-6">확인</DialogTitle>
      <p className="text-site-gray mb-10">{message}</p>
      <div className="flex gap-4 items-center justify-center">
        <Button type="button" onClick={handleDialogConfirm}>
          확인
          <IconCheck />
        </Button>
        <Button
          type="button"
          onClick={closeDialog}
          buttonColor={siteHexColor.gray}
        >
          취소
          <IconClose />
        </Button>
      </div>
    </div>
  );
}
