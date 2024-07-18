const SearchPageInput = ({ inputText, setInputText }) => {
  const handleKeyPress = (e) => {
    setInputText(e.target.value);
    console.log("inputText:", inputText);
  };
  return (
    <>
      <input
        className="px-2 py-1 mb-2 ring-1 focus:ring-2 ring-primary-800 focus:ring-primary-600 focus:outline-none rounded-md"
        type="text"
        value={inputText}
        onChange={handleKeyPress}
      />
      <button className="ml-4 py-1 px-4 rounded-md bg-other-buttons text-primary-50 hover:bg-primary-600">
        Search
      </button>
    </>
  );
};

export default SearchPageInput;
