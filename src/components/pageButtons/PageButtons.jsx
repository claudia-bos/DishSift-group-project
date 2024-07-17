import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

/**
 *  A styled set of pagination page buttons.
 *
 *  @component
 *
 *  @param {object} props - the componet accepts props.
 *  @param {Number} props.itemsPerPage - the number of items on a single page.
 *  @param {Number} props.totalItemsCount - the number of total items across all pages.
 *  @param {Number} props.desiredPageNumber - the page number to change to without clicking a page button.
 *  @param {Function} props.setPageNumber - a function to set the page number state on a parent component.
 *  @param {Function} props.toggleThePage - a function to toggle the state to trigger actions on a parent component.
 *
 *  @returns {JSX.Element} the rendered pagination page buttons
 */
const PageButtons = ({
  itemsPerPage,
  totalItemsCount,
  desiredPageNumber,
  setPageNumber,
  toggleThePage,
}) => {
  // Here we use item offsets; we could also use page offsets
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  console.log("PageButtons totalItemsCount:", totalItemsCount);

  const pageCount = Math.ceil(totalItemsCount / itemsPerPage);

  // Invoke when user clicks to request another page
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % totalItemsCount;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setCurrentPage(event.selected);
    setPageNumber(event.selected);
    toggleThePage();
    setItemOffset(newOffset);
  };

  const goToPage = (pageNumber) => {
    const newOffset = (pageNumber * itemsPerPage) % totalItemsCount;
    setItemOffset(newOffset);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (desiredPageNumber !== undefined) {
      console.log("Setting page number to:", desiredPageNumber);
      goToPage(desiredPageNumber);
    }
  }, [desiredPageNumber]);

  return (
    <div className="flex justify-center w-full text-primary-800">
      <ReactPaginate
        breakLabel="..."
        previousLabel={<ChevronLeftIcon className="size-7" />}
        nextLabel={<ChevronRightIcon className="size-7" />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={3}
        forcePage={currentPage}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        containerClassName="flex items-center gap-2 p-2"
        pageClassName="flex items-center justify-center rounded-full h-10 w-10 hover:bg-primary-100 hover:drop-shadow-md"
        pageLinkClassName="flex items-center justify-center rounded-full h-10 w-10"
        activeClassName="flex bg-other-buttons text-primary-50 h-10 w-10 drop-shadow-md hover:bg-other-buttons"
        activeLinkClassName="bg-transparent text-primary-50 rounded-full hover:bg-other-buttons"
        disabledClassName="hover:bg-transparent text-neutral-300"
        disabledLinkClassName="hover:cursor-default"
        breakClassName="flex items-center justify-center rounded-full h-10 w-10 hover:bg-primary-100 hover:drop-shadow-md"
        breakLinkClassName="flex items-center justify-center rounded-full h-10 w-10"
        previousClassName="flex items-center justify-center rounded-full h-10 w-10 hover:bg-primary-100 hover:drop-shadow-md"
        previousLinkClassName="flex items-center justify-center rounded-full h-10 w-10"
        nextClassName="flex items-center justify-center rounded-full h-10 w-10 hover:bg-primary-100 hover:drop-shadow-md"
        nextLinkClassName="flex items-center justify-center rounded-full h-10 w-10"
      />
    </div>
  );
};

export default PageButtons;
