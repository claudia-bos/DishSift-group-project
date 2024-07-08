import React, { useState } from 'react'
import Login from '../login/Login.jsx'
import { Link } from 'react-router-dom'

const Header = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false)

    const handleLoginClick = () => {
        setShowLogin(true);
    }

    const closePopup = () => {
        setShowLogin(false);
    }

    const handleDropdownToggle = () => {
        setDropdownVisible(!dropdownVisible);
    }



  return (

    <header>
        <div>
            <div>
                <Link to='/'>
                    <h1>Dishsift</h1>
                </Link>
            </div>
            <nav>
                <div>
                    <span onClick={handleDropdownToggle}>Recipes</span>
                    {dropdownVisible && (
                        <div>
                            <Link to='/search-page'>All Recipes</Link>
                            <br/>
                            <Link to='/pantry-page'>Pantry Recipes</Link>
                        </div>
                    )}
                </div>
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