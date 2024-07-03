import React, {useState} from 'react'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault()

        console.log('user Log in');
    };



  return (

    <div>
        <div>
            <h2>Login</h2>
            
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    id='email'
                    name='email'
                    placeholder='youreamil@gmail.com'
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

        </div>
    </div>
  )
}

export default Login