"use client";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import IconCheck from "@/components/common/icons/icon-check";
import IconClose from "@/components/common/icons/icon-close";
import { Button } from "@/components/common/index";

type RunnerTypeFilter = "all" | "guide_runner" | "blind_runner";

export default function FilterDialog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilter =
    (searchParams.get("runner_type") as RunnerTypeFilter) || "all";
  const [selectedType, setSelectedType] =
    useState<RunnerTypeFilter>(initialFilter);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    if (selectedType === "all") {
      params.delete("runner_type");
    } else {
      params.set("runner_type", selectedType);
    }
    params.set("page", "1");

    router.push(`/post/list?${params.toString()}`);
  };

  return (
    <div className="text-left">
      <DialogTitle className="text-2xl font-bold mb-6 text-center">
        동반주자 필터
      </DialogTitle>

      <div className="mb-6">
        <h3 className="font-bold text-site-gray mb-2">회원 유형</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedType("all")}
            className={`p-3 rounded-lg font-bold transition-colors ${
              selectedType === "all"
                ? "bg-site-yellow text-site-black"
                : "text-site-white border border-site-gray hover:bg-gray-700"
            }`}
          >
            전체보기
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("guide_runner")}
            className={`p-3 rounded-lg font-bold transition-colors cursor-pointer ${
              selectedType === "guide_runner"
                ? "bg-site-yellow text-site-black"
                : "text-site-white border border-site-gray hover:bg-gray-700"
            }`}
          >
            가이드러너
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("blind_runner")}
            className={`p-3 rounded-lg font-bold transition-colors cursor-pointer ${
              selectedType === "blind_runner"
                ? "bg-site-yellow text-site-black"
                : "text-site-white border border-site-gray hover:bg-gray-700"
            }`}
          >
            시각장애인
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-site-gray mb-2">지역</h3>
        <div className="grid grid-cols-2 gap-2">
          <select className="p-3 rounded-lg text-white border border-site-gray w-full appearance-none text-center bg-site-lightblack">
            <option>시 / 선택</option>
            <option>준비중 입니다.</option>
          </select>
          <select className="p-3 rounded-lg text-white border border-site-gray w-full appearance-none text-center bg-site-lightblack">
            <option>구 / 선택</option>
            <option>준비중 입니다.</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4 items-center justify-center">
        <DialogClose asChild>
          <Button onClick={handleApply}>
            적용
            <IconCheck />
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button buttonColor="#878B94">
            취소
            <IconClose />
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}
