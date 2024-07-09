import React, { useState } from 'react'

//currentIndex starts at 0, meaning it will start showing from the first recipe
//the handlerPevButton 's will update the carousel so it will show the previous and the next recipes depending in where the current index is 

const Carousel = ({ recipes }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    if (!recipes || !recipes.length) return <p>Loading recipes...</p>;

    const handlePrevButton = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? recipes.length -1 : prevIndex - 1));
    };

    const handleNextButton = () => {
        setCurrentIndex((prevIndex) => (prevIndex === recipes.length -1 ? 0 : prevIndex + 1));
    };


 // TODO: for each recipe it will be display the name and the recipe image, this is obviously just an example data
 //we will updated with the right data to display name of restaurant , and image 
 //recipe.label is the name of the recipe
  return (
    <div>
        <button onClick={handlePrevButton}>left</button>
        <div>
            {recipes.slice(currentIndex, currentIndex + 4).map(({ recipe }) => (
                <div>
                    <img src={recipe.image} />
                    <h3>{recipe.label}</h3>
                </div>
            ))}
        </div>
        <button onClick={handleNextButton}>right</button>
    </div>
  )

};

export default Carousel