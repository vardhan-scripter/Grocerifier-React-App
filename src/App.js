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
import 'font-awesome/css/font-awesome.min.css';
import Orders from "./Components/Orders";
import Order from "./Components/Order";
import client from "./Axios";
import Alert from "./Components/Alert";


const App = () => {
  const [allValues, setAllValues] = useState({
    isUserAuthenticated: false,
    token: null,
    username: null
  });
  const [notification, setNotification] = useState({
    isRequired: false,
    type: null,
    message: null
  })

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

  const handleLogin = async (email, password) => {
    if (email.length > 8 && password.length > 8) {
      try {
        const response = await client.post(
          "/api/auth/login",
          {
            email: email,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setAllValues({
            isUserAuthenticated: true,
            token: response.data.token,
            username: response.data.username,
          });
          const authInfo = {
            authToken: response.data.token,
            expiresIn: Date.now() + +response.data.expiresIn * 1000,
            username: response.data.username,
          };
          localStorage.setItem("authInfo", JSON.stringify(authInfo));
          navigate("/dashboard", { replace: true });
        } else {
          throw response.err;
        }
      } catch {
        setNotification({
          isRequired: true,
          type: 'danger',
          message: 'Something went wrong at server side, please try after sometime'
        })
      }
    } else {
      setNotification({
        isRequired: true,
        type: 'warning',
        message: 'Please enter all the details properly'
      })
    }
  };

  const handleRegister = async (email, username, password) => {
    if (email.length > 8 && password.length > 8 && username.length > 8) {
      try {
        const response = await client.post(
          "/api/auth/register",
          {
            email: email,
            username: username,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setNotification({
            isRequired: true,
            type: 'success',
            message: 'User registered successfully'
          })
          navigate("/login", { replace: true });
        } else {
          throw response.err;
        }
      } catch {
        setNotification({
          isRequired: true,
          type: 'danger',
          message: 'Something went wrong at server side, please try after sometime'
        })
      }
    } else {
      setNotification({
        isRequired: true,
        type: 'warning',
        message: 'Please enter all the details properly'
      })
    }
  };

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

  const handleNotification = () => {
    setNotification({
      isRequired: false,
      type: null,
      message: null
    })
  }
  
  return (
    <div className="App">
      {notification.isRequired ? (
        <Alert type={notification.type} message={notification.message} closeAlert={handleNotification}></Alert>
      ) : null}
      <Routes>
        <Route path="/" element={<Layout isUserAuthenticated={allValues.isUserAuthenticated} handleLogout={handleLogout} username={allValues.username} />}>            
          <Route index element={<Home />} />
          <Route path="login" element={<Login loginHandler={handleLogin} />} />
          <Route path="register" element={<Register registerHandler={handleRegister} />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<Order />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
  </div>
  );
}
export default App;
