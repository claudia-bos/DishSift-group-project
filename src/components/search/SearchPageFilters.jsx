import { GiCheckMark } from "react-icons/gi";

const SearchPageFilters = ({
  label,
  filters,
  setFilters,
  toggleThePage,
  id,
}) => {
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
    toggleThePage();
  };

  return (
    <div className="flex justify-start">
      <div className="fixed transition-all">
        <input
          className="peer relative w-6 h-6 ring-1 ring-secondary-600 appearance-none border-green-500 rounded-md bg-primary-0 checked:bg-secondary-500 hover:cursor-pointer"
          type="checkbox"
          id={`label${id}`}
          defaultChecked={false}
          checked={filters.includes(label)}
          onChange={handleChange}
        />
        <div className="absolute top-3 left-3 text-secondary-50 transition-opacity opacity-0 pointer-events-none -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100 peer-hover:opacity-100 peer-hover:text-secondary-300">
          <GiCheckMark />
        </div>
      </div>

      <label className="relative left-6 ml-2" htmlFor={`label${id}`}>
        {label}
      </label>
    </div>
  );
};

export default SearchPageFilters;
