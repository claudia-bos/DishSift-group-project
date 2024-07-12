const SearchPageInput = ({ inputText, setInputText }) => {
  const handleKeyPress = (e) => {
    setInputText(e.target.value);
    console.log("inputText:", inputText);
  };
  return (
    <>
      <input type="text" value={inputText} onChange={handleKeyPress} />
      <button>Search</button>
    </>
  );
};

export default SearchPageInput;
