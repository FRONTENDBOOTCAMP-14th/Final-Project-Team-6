"use client";
import { DialogTitle } from "@radix-ui/react-dialog";
import Button from "@/components/common/button";
import IconCheck from "@/components/common/icons/icon-check";
import IconClose from "@/components/common/icons/icon-close";
import { siteHexColor } from "@/constant";
import { useDialog } from "@/stores/use-dialog";

export default function DialogTrigger() {
  const { closeDialog } = useDialog();
  const openDialog = useDialog((s) => s.openDialog);

  const handleAlertDialog = () => {
    openDialog("alert", { message: "알림용 모달 입니다." });
  };

  const handleConfirmDialog = () => {
    openDialog("confirm", {
      message: "로그인이 필요한 서비스 입니다. 로그인 하시겠습니까?",
      onConfirm: () => alert("여기에 확인시 진행될 로직 작성"),
    });
  };

  const handleCustomDialog = () => {
    openDialog("custom", {
      content: (
        <div>
          <DialogTitle className="text-2xl font-bold mb-6">
            목록 필터
          </DialogTitle>

          <div className="mb-10">자유롭게 내용채우기</div>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => {
                alert("여기에 적용시 진행될 로직 작성");
                closeDialog();
              }}
            >
              적용 <IconCheck />
            </Button>
            <Button onClick={closeDialog} buttonColor={siteHexColor.gray}>
              취소 <IconClose />
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="flex gap-5">
      <Button onClick={handleAlertDialog}>Alert Dialog</Button>
      <Button onClick={handleConfirmDialog}>Confirm Dialog</Button>
      <Button onClick={handleCustomDialog}>Custom Dialog</Button>
    </div>
  );
}
