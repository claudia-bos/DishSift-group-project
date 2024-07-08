// delete later
import React, {useState} from 'react'

const Login = ({ closePopup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault()

        console.log('user Log in');

        closePopup();
    };



  return (

    <div>
        <div>
            <h2>Login</h2>
            
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type='username'
                    id='username'
                    name='username'
                    placeholder='Jhon11'
                    required
                />

                <label>Password:</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    id='password'
                    name='password'
                    placeholder='********'
                    required
                />

                <button type='submit'>Login</button>
           </form>
           <button onClick={closePopup}>Close</button>

        </div>
    </div>
  )
}

export default Login
