import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from '../Axios';
import Alert from "./Alert";

export default function UpdatePassword(props) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({
    isRequired: false,
    type: '',
    message: ''
  })

  const navigate = useNavigate();
  useEffect(() => {
    const authInfo = localStorage.getItem("authInfo");
    if (authInfo !== null) {
      const authInfoJson = JSON.parse(authInfo);
      if (new Date() < new Date(authInfoJson.expiresIn)) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (email.length > 8 && otp.length === 4 && email.length > 8) {
      try {
        const response = await client.post(
          "/api/auth/updatepassword",
          {
            email: email,
            otp: otp,
            password: password
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
            message: 'Password updated, please login'
          })
          console.log(response.data);
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 1000);
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

  const handleNotification = () => {
    setNotification({
      isRequired: false,
      type: null,
      message: null
    })
  }

  return (
    <div className="container page-body">
    {notification.isRequired ? (
      <Alert type={notification.type} message={notification.message} closeAlert={handleNotification}></Alert>
    ) : null}
      <div className="d-flex justify-content-center">
        <div className="col-md-3 vertical-center">
          <form onSubmit={handleUpdatePassword}>
            <div className="text-center mb-4">
              <h1>Sign Up</h1>
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

            <div className="form-outline mb-2">
              <input
                type="text"
                id="otp"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <label className="form-label" htmlFor="otp">
                OTP
              </label>
            </div>

            <div className="form-outline mb-2">
              <input
                type="password"
                id="signUpPassword"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="form-label" htmlFor="signUpPassword">
                Password
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mb-4 submit-button"
            >
              Update Password
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
