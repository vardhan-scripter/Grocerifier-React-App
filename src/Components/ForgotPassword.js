import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from '../Axios';
import Alert from "./Alert";
import defaultNotification from "../DefaultNotification";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(defaultNotification)

  const navigate = useNavigate();
  useEffect(() => {
    const authInfo = localStorage.getItem("authInfo");
    if (authInfo !== null) {
      const authInfoJson = JSON.parse(authInfo);
      if (new Date() < new Date(authInfoJson.expiresIn)) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (email.length > 8) {
      try {
        const response = await client.post(
          '/api/auth/forgotpassword',
          {
            email: email
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
            message: 'OTP sent to your email and mobile number, please check'
          })
          console.log(response.data);
          setTimeout(() => {
            navigate("/updatePassword", { replace: true });
          }, 1000);
        } else {
          throw response.err;
        }
      } catch (err) {
        if(err.response.status === 404){
          setNotification({
            isRequired: true,
            type: 'danger',
            message: 'Email not exists, please enter valid email address'
          })
        } else {
          setNotification({
            isRequired: true,
            type: 'danger',
            message: 'Something went wrong at server side, please try after sometime'
          })
        }
      }
    } else {
      setNotification({
        isRequired: true,
        type: 'warning',
        message: 'Please enter all the details properly'
      })
    }
  };

  return (
    <div className="container page-body">
      {notification.isRequired ? (
        <Alert type={notification.type} message={notification.message} closeAlert={() => setNotification(defaultNotification)}></Alert>
      ) : null}
      <div className="d-flex justify-content-center">
        <div className="col-md-3 vertical-center">
          <form onSubmit={handleForgotPassword}>
            <div className="text-center mb-4">
              <h1>Forgot Password</h1>
            </div>
            <div className="form-outline mb-2">
              <input
                type="email"
                id="loginName"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="form-label" htmlFor="loginName">
                Email
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mb-4 submit-button"
            >
              Send OTP
            </button>

            <div className="text-center">
              <p>
                Want to <Link to="/login">Login</Link> ?
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
