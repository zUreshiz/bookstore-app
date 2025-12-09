import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const AppPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showEllipsis = true,
}) => {
  // Tạo danh sách page hiển thị gọn gàng
  const getPages = () => {
    const pages = [];

    if (totalPages <= 6 || !showEllipsis) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pages;
  };

  const pages = getPages();

  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex justify-center mb-10  ">
      <Pagination>
        <PaginationContent>
          {/* Prev */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={`!text-lg
    ${
      currentPage === 1
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer hover:bg-blue-600 hover:text-white"
    }
  `}
            />
          </PaginationItem>

          {/* Pages */}
          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page)}
                  className={`
    cursor-pointer
    !text-lg
    ${
      currentPage === page
        ? "bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
        : ""
    }
  `}>
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={`!text-lg
    ${
      currentPage === totalPages
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer hover:bg-blue-600 hover:text-white"
    }
  `}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AppPagination;
