"use client";

import { useRouter } from "next/navigation";
import PaginationButton from "./pagination-button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void; // CSR용 (선택사항)
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const router = useRouter();

  const handleCurrentPage = (page: number) => {
    if (onPageChange) {
      // CSR일 때
      onPageChange(page);
    } else {
      // SSR일 때
      router.push(`?page=${page}`);
    }
  };

  return (
    // 페이지가 1개 이하일 때는 페이지네이션 UI를 표시하지 않음
    totalPages > 1 && (
      <nav className="flex gap-x-2 items-center justify-center">
        <PaginationButton
          direction="prev"
          className={currentPage <= 1 ? "invisible" : ""}
          aria-hidden={currentPage <= 1 ? "true" : undefined}
          onClick={() => handleCurrentPage(currentPage - 1)}
        />
        <div
          aria-live="assertive"
          aria-atomic="true"
          className="px-4 py-2.5 relative"
        >
          <span aria-hidden="true">
            {currentPage} / {totalPages}
          </span>
          <span className="sr-only">
            현재 페이지는 {currentPage}, 전체 페이지는 {totalPages}개 입니다.
          </span>
        </div>
        <PaginationButton
          direction="next"
          className={currentPage >= totalPages ? "invisible" : ""}
          aria-hidden={currentPage >= totalPages ? "true" : undefined}
          onClick={() => handleCurrentPage(currentPage + 1)}
        />
      </nav>
    )
  );
}
