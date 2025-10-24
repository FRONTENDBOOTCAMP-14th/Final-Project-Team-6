"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import IconFilter from "@/components/common/icons/icon-filter";
import FilterDialog from "./filter-dialog";

export default function PostListHeader() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <Dialog.Root open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">동반주자 목록</h1>
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label="목록 필터 열기"
            className="cursor-pointer w-10 aspect-square flex items-center justify-center"
          >
            <IconFilter />
          </button>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%_-_80px)] max-w-100 bg-site-lightblack text-center p-8 rounded-lg">
          <FilterDialog />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
