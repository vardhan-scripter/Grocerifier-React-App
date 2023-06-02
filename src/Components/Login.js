import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredUserAuth } from "../Utils/GetStoredUserAuth";

export default function Login(props) {
  const { loginHandler } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    loginHandler(email, password);
  };

  const navigate = useNavigate();
  useEffect(() => {
    const auth = getStoredUserAuth();
    if (auth !== null) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="container page-body">
      <div className="d-flex justify-content-center">
        <div className="col-md-3 vertical-center">
          <form onSubmit={handleLogin}>
            <div className="text-center mb-4">
              <h1>Sign In</h1>
            </div>
            <div className="form-outline mb-2">
              <input
                type="email"
                id="loginEmail"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="form-label" htmlFor="loginEmail">
                Email
              </label>
            </div>

            <div className="form-outline mb-2">
              <input
                type="password"
                id="loginPassword"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="form-label" htmlFor="loginPassword">
                Password
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mb-2 submit-button"
            >
              Sign In
            </button>

            <div className="row mb-3">
              <div className="col-md-12 text-align-right">
                <Link to='/forgotPassword'>Forgot password?</Link>
              </div>
            </div>

            <div className="text-center">
              <p>
                Not a member? <Link to="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
