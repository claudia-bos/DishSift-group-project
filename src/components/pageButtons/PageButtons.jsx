import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const PageButtons = ({
  itemsPerPage,
  totalItemsCount,
  buttonClickFunction,
}) => {
  // Here we use item offsets; we could also use page offsets
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const pageCount = Math.ceil(totalItemsCount / itemsPerPage);

  // Invoke when user clicks to request another page
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % totalItemsCount;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    buttonClickFunction(event.selected);
    setItemOffset(newOffset);
  };

  return (
    <div className="flex justify-center w-screen text-primary-800">
      <ReactPaginate
        breakLabel="..."
        previousLabel={<ChevronLeftIcon className="size-7" />}
        nextLabel={<ChevronRightIcon className="size-7" />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={3}
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
