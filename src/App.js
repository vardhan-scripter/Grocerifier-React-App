import React, { useEffect, useReducer, useState } from "react";
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
import client from "./Utils/Axios";
import Alert from "./Components/Alert";
import ForgotPassword from "./Components/ForgotPassword";
import UpdatePassword from "./Components/UpdatePassword";
import UserDetailsContext from "./Utils/UserDetailsContext";
import { getStoredUserAuth } from "./Utils/GetStoredUserAuth";
import { initialNotification, notificationReducer } from "./Utils/NotificationReducer";

const App = () => {
  const [allValues, setAllValues] = useState({
    authorized: false,
    authToken: null,
    userName: null
  });
  const [notification, dispatchNotification] = useReducer(notificationReducer, initialNotification)

  const navigate = useNavigate();
  useEffect(() => {
    const auth = getStoredUserAuth();
    if (auth !== null) {
      setAllValues({
        authorized: true,
        authToken: auth.authToken,
        userName: auth.userName
      })
    }else{
      navigate('/login', { replace: true });
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
            authorized: true,
            authToken: response.data.authToken,
            userName: response.data.userName,
          });
          const authInfo = {
            authToken: response.data.authToken,
            expiresIn: Date.now() + +response.data.expiresIn * 1000,
            userName: response.data.userName,
          };
          localStorage.setItem("UserAuth", JSON.stringify(authInfo));
          navigate("/dashboard", { replace: true });
        } else {
          throw response.err;
        }
      } catch(err) {
        if(err.response.status === 401){
          dispatchNotification({
            type: "DANGER",
            payload: "Credential mismatch!, Please enter valid credentials",
          });
        } else{
          dispatchNotification({
            type: "DANGER",
            payload: "Something went wrong at server side, please try after sometime",
          });
        }
      }
    } else {
      dispatchNotification({
        type: "WARNING",
        payload: "Please enter all the details properly",
      });
    }
  };

  const handleRegister = async (email, userName, password) => {
    if (email.length > 8 && password.length > 8 && userName.length > 8) {
      try {
        const response = await client.post(
          "/api/auth/register",
          {
            email: email,
            userName: userName,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          dispatchNotification({
            type: "success",
            payload: "User registered successfully",
          });
          navigate("/login", { replace: true });
        } else {
          throw response.err;
        }
      } catch (err) {
        if(err.response.status === 400){
          dispatchNotification({
            type: "DANGER",
            payload: "Email already registered, Please enter valid details",
          });
        } else {
          dispatchNotification({
            type: "DANGER",
            payload: "Something went wrong at server side, please try after sometime",
          });
        }
      }
    } else {
      dispatchNotification({
        type: "WARNING",
        payload: "Please enter all the details properly",
      });
    }
  };

  const handleLogout = () => {
    setAllValues({
      authorized: false,
      authToken: null,
      userName: null
    })
    localStorage.removeItem("UserAuth");
    // Need to redirect to login page
    navigate('/login', { replace: true });
  }
  
  return (
    <UserDetailsContext.Provider value={{   
      authorized: allValues.authorized,
      userName: allValues.userName
    }}>
      <div className="App">
        {notification.isRequired && (
          <Alert type={notification.type} message={notification.message} closeAlert={() => dispatchNotification({type: 'RESET'})}></Alert>
        )}
        <Routes>
          <Route path="/" element={<Layout handleLogout={handleLogout} />}>            
            <Route index element={<Home handleLogout={handleLogout} />} />
            <Route path="login" element={<Login loginHandler={handleLogin} />} />
            <Route path="register" element={<Register registerHandler={handleRegister} />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<Order />} />
            <Route path="forgotPassword" element={<ForgotPassword />} />
            <Route path="updatePassword" element={<UpdatePassword />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </div>
    </UserDetailsContext.Provider>
  );
}
export default App;
