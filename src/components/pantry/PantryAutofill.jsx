import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const PantryAutoFill = ({ food, inputText, setInputText }) => {
  const userId = useSelector((state) => state.userId);

  const handleClick = async () => {
    setInputText("");
    await axios.post("/api/pantry/add", {
      userId: userId,
      foodId: food.foodId,
    });
  };

  return (
    <div>
      {inputText != "" &&
        food.foodName.slice(0, inputText.length) === inputText && (
          <p onClick={handleClick}>{food.foodName}</p>
        )}
    </div>
  );
};

export default PantryAutoFill;
