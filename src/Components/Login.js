import React, { useState } from 'react';

function Login() {

  const username = "John";
  const password = "1234";

  const [usernameState, setUsername] = useState("");
  const [passwordState, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLogin() {
    if (usernameState === username && passwordState === password) {
      setIsLoggedIn(true);
      alert("Login successful!");
    } else {
      alert("Login failed!");
    }
  }

  function loginPage() {
    return (
      <div>
        <h1><u>Login Page</u></h1>
        Username: <input type="text" placeholder="Username" value={usernameState} onChange={(e) => setUsername(e.target.value)} />
        <br></br>
        Password: <input type="password" placeholder="Password" value={passwordState} onChange={(e) => setPassword(e.target.value)} />
        <br></br>
        <button onClick={handleLogin}>Login</button>
      </div>) 
  }

  return (
    <div className="App">
      {!isLoggedIn && loginPage()}

      {isLoggedIn && 
        <h1> Logged In </h1>
      }
    </div>
  );
}

export default Login;
