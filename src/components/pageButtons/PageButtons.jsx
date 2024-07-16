import React, { useState } from "react";
import ReactPaginate from "react-paginate";

const PageButtons = ({
  itemsPerPage,
  totalItemsCount,
  buttonClickFunction,
}) => {
  // Here we use item offsets; we could also use page offsets
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
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
    <div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default PageButtons;
