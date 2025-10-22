"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useDialog } from "@/stores/use-dialog";
import Button from "../common/button";
import IconCheck from "../common/icons/icon-check";

export default function AlertDialog() {
  const { message, closeDialog } = useDialog();

  return (
    <>
      <DialogTitle className="text-2xl font-bold mb-6">알림</DialogTitle>
      <p className="text-site-gray mb-10 whitespace-pre-line leading-normal">
        {message}
      </p>
      <Button type="button" onClick={closeDialog} fullWidth className="mx-auto">
        확인 <IconCheck />
      </Button>
    </>
  );
}
