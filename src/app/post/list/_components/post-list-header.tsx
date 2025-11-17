"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import IconFilter from "@/components/common/icons/icon-filter";
import FilterDialog from "./filter-dialog";

type PostListType = "all" | "my_posts" | "my_applications";

export default function PostListHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const currentListType =
    (searchParams.get("list_type") as PostListType) || "all";

  const handleListTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const listType = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (listType === "all") {
      params.delete("list_type");
    } else {
      params.set("list_type", listType);
    }

    params.set("page", "1");
    router.push(`/post/list?${params.toString()}`);
  };

  const optionClassName = "text-site-black text-lg font-semibold";

  return (
    <div className="flex justify-between items-center mb-4 min-h-10">
      <label htmlFor="postListType" className="sr-only">
        게시글 목록 유형 선택
      </label>
      <select
        id="postListType"
        value={currentListType}
        onChange={handleListTypeChange}
        className="text-2xl font-bold bg-transparent text-site-white cursor-pointer"
      >
        <option value="all" className={optionClassName}>
          동반주자 목록
        </option>
        <option value="my_posts" className={optionClassName}>
          내가 작성한 글
        </option>
        <option value="my_applications" className={optionClassName}>
          내가 신청한 글
        </option>
      </select>
      {currentListType === "all" && (
        <Dialog.Root open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="목록 필터 열기"
              className="cursor-pointer w-[40px] h-[40px] flex items-center justify-center"
            >
              <IconFilter />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/80" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%_-_80px)] max-w-100 bg-site-lightblack text-center p-8 rounded-lg">
              <FilterDialog />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
