import React, { useState } from 'react'
import Login from '../login/Login.jsx'
import { Link } from 'react-router-dom'

const Header = () => {
    const [showLogin, setShowLogin] = useState(false);

    const handleLoginClick = () => {
        setShowLogin(true);
    }

    const closePopup = () => {
        setShowLogin(false);
    }



  return (

    <header>
        <div>
            <div>
                <input type='text' placeholder='Search for "Chicken Recipes"'/>
                <button type='submit'>Search</button>
            </div>
            <div>
                <Link to='/'>
                    <h1>Dishsift</h1>
                </Link>
            </div>
            <nav>
                <Link to='/SearchPage'>Find Recipe</Link>
                <br/>
                <span onClick={handleLoginClick}>Log in</span>
                <br/>
                <Link to='/register'>Sign Up</Link>
            </nav>
            {showLogin && <Login closePopup={closePopup}/>}

        </div>
    </header>



  )
}

export default Header