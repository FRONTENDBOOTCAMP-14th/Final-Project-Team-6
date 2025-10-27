"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Pagination from "@/components/pagination/pagination";
import ChatListContent from "./chat-list-content";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function ChatListWrapper({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(`?page=${page}`);
    });
  };

  return (
    <>
      <ChatListContent isPending={isPending} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
