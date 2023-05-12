import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";
import Cart from "./Components/Cart";


const App = () => {
  const [allValues, setAllValues] = useState({
    isUserAuthenticated: false,
    token: null,
    username: null
  });
  const navigate = useNavigate();
  useEffect(() => {
    const authInfo = localStorage.getItem("authInfo");
    if (authInfo !== null) {
      const authInfoJson = JSON.parse(authInfo);
      if (new Date() < new Date(authInfoJson.expiresIn)) {
        setAllValues({
          isUserAuthenticated: true,
          token: authInfoJson.token,
          username: authInfoJson.username
        })
      } else {
        localStorage.removeItem("authInfo");
        navigate('/login', { replace: true });
      }
    }
  }, []);

  const handleLogin = (email, password) => {
    if (email.length > 8 && password.length > 8) {
      fetch("http://localhost:5000/api/auth/login", {
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.token !== null) {
            setAllValues({
              isUserAuthenticated: true,
              token: response.token,
              username: response.username
            })
            const authInfo = {
              authToken: response.token,
              expiresIn: Date.now() + (+response.expiresIn * 1000),
              username: response.username
            };
            localStorage.setItem("authInfo", JSON.stringify(authInfo));
            navigate('/dashboard', { replace: true });
          } else {
            console.log(response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const handleRegister = (email, username, password) => {
    if (email.length > 8 && password.length > 8 && username.length > 8) {
      fetch("http://localhost:5000/api/auth/register", {
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success === true) {
            alert('User registered successfully');
          } else {
            console.log(response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }else{
      alert('Please enter all the details properly');
    }
  }

  const handleLogout = () => {
    setAllValues({
      isUserAuthenticated: false,
      token: null,
      username: null
    })
    localStorage.removeItem("authInfo");
    // Need to redirect to login page
    navigate('/login', { replace: true });
  }
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout isUserAuthenticated={allValues.isUserAuthenticated} handleLogout={handleLogout} username={allValues.username} />}>            
          <Route index element={<Home />} />
          <Route path="login" element={<Login loginHandler={handleLogin} />} />
          <Route path="register" element={<Register registerHandler={handleRegister} />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
  </div>
  );
}
export default App;
