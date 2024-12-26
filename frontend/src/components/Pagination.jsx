import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { usePagination, DOTS } from "../hooks/usePagination";

const Pagination = ({
  onPageChange,
  page,
  totalPages,
  siblingCount,
  limit,
  className,
}) => {
  const paginationRange = usePagination({
    page,
    limit,
    total: totalPages,
    siblingCount,
  });
  const lastPage = paginationRange[paginationRange.length - 1];

  // If there are less than 2 items in pagination range, we shall not render the component
  if (page === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(Math.min(page + 1, lastPage));
  };

  const onPrevious = () => {
    onPageChange(Math.max(page - 1, 1));
  };

  const itemClass =
    "text-sm text-slate-700 font-medium rounded px-3 py-1.5 bg-transparent cursor-pointer hover:bg-primary/10 transition duration-300";
  const arrowClass = "flex justify-center items-center";
  const dotsClass = "cursor-default";
  const selectedClass = "text-primary bg-primary/10";
  const disabledClass = "text-slate-400 cursor-default hover:bg-transparent";
  const iconSize = 18;

  return (
    <ul
      className={twMerge(
        "flex w-full items-stretch justify-end gap-x-1 rounded-lg bg-white/50 px-6 py-3 shadow-lg",
        className
      )}
    >
      {/* Left navigation arrow */}
      <li
        className={twMerge(
          itemClass,
          arrowClass,
          page === 1 ? disabledClass : ""
        )}
        onClick={onPrevious}
      >
        <FiChevronLeft size={iconSize} />
      </li>
      {paginationRange.map((pageNumber, i) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <li key={`page-${i}`} className={twMerge(itemClass, dotsClass)}>
              &#8230;
            </li>
          );
        }

        // Render Page Pills
        return (
          <li
            key={`page-${i}`}
            className={twMerge(
              itemClass,
              pageNumber === page ? selectedClass : ""
            )}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      {/* Right Navigation arrow */}
      <li
        className={twMerge(
          itemClass,
          arrowClass,
          page === lastPage ? disabledClass : ""
        )}
        onClick={onNext}
      >
        <FiChevronRight size={iconSize} />
      </li>
    </ul>
  );
};

export default Pagination;
