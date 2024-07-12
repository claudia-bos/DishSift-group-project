const SearchPageFilters = ({ label, filters, setFilters }) => {
  const handleChange = (e) => {
    if (e.target.checked) {
      setFilters([...filters, label]);
      console.log("filters:", filters);
    } else {
      const filtersCopy = [...filters];
      const indexToRemove = filtersCopy.indexOf(label);
      filtersCopy.splice(indexToRemove, 1);
      setFilters(filtersCopy);
    }
  };

  return (
    <>
      <label htmlFor="label">{label}</label>
      <input
        type="checkbox"
        id="label"
        defaultChecked={false}
        checked={filters.includes(label)}
        onChange={handleChange}
      />
    </>
  );
};

export default SearchPageFilters;
