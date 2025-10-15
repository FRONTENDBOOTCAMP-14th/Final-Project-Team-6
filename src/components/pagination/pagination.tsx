"use client";

import { useRouter } from "next/navigation";
import PaginationButton from "./pagination-button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();

  const handleCurrentPage = (page: number) => {
    router.push(`?page=${page}`);
  };

  return (
    // 페이지가 1개 이하일 때는 페이지네이션 UI를 표시하지 않음
    totalPages > 1 && (
      <nav className="flex gap-x-2 items-center justify-center">
        <PaginationButton
          direction="prev"
          className={currentPage <= 1 ? "invisible" : ""}
          onClick={() => handleCurrentPage(currentPage - 1)}
        />
        <div className="px-4 py-2.5">
          {currentPage} / {totalPages}
        </div>
        <PaginationButton
          direction="next"
          className={currentPage >= totalPages ? "invisible" : ""}
          onClick={() => handleCurrentPage(currentPage + 1)}
        />
      </nav>
    )
  );
}
