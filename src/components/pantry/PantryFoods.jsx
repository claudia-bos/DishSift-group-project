import axios from "axios";
import { FaRegTrashAlt } from "react-icons/fa";

const PantryFoods = ({
  food,
  setPantryFoodData,
  userId,
  setPantryPageNumber,
  toggleThePage,
}) => {
  const handleClick = async () => {
    await axios.delete(`/api/pantry/delete/${food.foodId}`);

    await axios.get(`/api/pantry/foods/${userId}`).then((res) => {
      setPantryFoodData(res.data);
      setPantryPageNumber(0);
      toggleThePage();
    });
  };
  return (
    <div className="flex items-center px-4 py-1 rounded-full drop-shadow-md text-secondary-1000 bg-secondary-300">
      <div className="drop-shadow">
        {food.foodName.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
          letter.toUpperCase()
        )}
      </div>
      <div className="ml-2">
        <FaRegTrashAlt
          className=" text-sm drop-shadow hover:cursor-pointer hover:text-secondary-700"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default PantryFoods;
