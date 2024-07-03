import React, { useState } from 'react'


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = ('');

    const handleSubmit = (e) => {
        e.preventDefault();

    }



  return (

    <div>
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type='username'
                    name='username'
                    id='username'
                    placeholder='Jhon11'
                    required
                />

                <label>Password:</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    name='password'
                    id='password'
                    placeholder='*******'
                    required
                />

                <label>Confirm Password:</label>
                <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type='password'
                    required
                />

                <button type='submit'>Sign Up</button>

            </form>

        </div>
    </div>
  )
}

export default Register