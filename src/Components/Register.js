import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register(props) {
  const { registerHandler } = props;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    registerHandler(email, username, password);
  };

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

  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <div className="col-md-3 vertical-center">
          <form onSubmit={handleRegister}>
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
              <label className="form-label" for="loginName">
                Email
              </label>
            </div>

            <div className="form-outline mb-2">
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label className="form-label" for="username">
                User Name
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
              <label className="form-label" for="signUpPassword">
                Password
              </label>
            </div>

            <div className="form-outline mb-2">
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label className="form-label" for="confirmPassword">
                Confirm Password
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mb-4 submit-button"
            >
              Sign Up
            </button>

            <div className="text-center">
              <p>
                Already a member ? <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
