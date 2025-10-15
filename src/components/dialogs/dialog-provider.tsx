"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useDialog } from "@/stores/use-dialog";
import AlertDialog from "./alert-dialog";
import ConfirmDialog from "./confirm-dialog";
import CustomDialog from "./custom-dialog";

export default function DialogProvider() {
  const { type, closeDialog } = useDialog();

  const renderModal = () => {
    switch (type) {
      case "alert":
        return <AlertDialog />;
      case "confirm":
        return <ConfirmDialog />;
      case "custom":
        return <CustomDialog />;
      default:
        return null;
    }
  };

  return (
    <Dialog.Root open={!!type} onOpenChange={(open) => !open && closeDialog()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%_-_80px)] max-w-100 bg-site-lightblack text-center p-8 rounded-lg">
          {renderModal()}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
