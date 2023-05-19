import React from "react";
import { NavLink } from "react-router-dom";

export default function Header(props) {
  const { authourized } = props;
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Grocerifier</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {authourized ? <AuthRoutes handleLogout={props.handleLogout} username={props.username}/> : <UnAuthRoutes />}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function UnAuthRoutes() {
  return (
    <React.Fragment>
      <li className="nav-item">
        <NavLink className="nav-link" aria-current="page" to="/login">Login</NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/register">Signup</NavLink>
      </li>
    </React.Fragment>
  );
}

function AuthRoutes(props) {
  return (
    <React.Fragment>
      <li className="nav-item">
        <NavLink className="nav-link" to="/cart">
          <i className="fa fa-shopping-cart"></i>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/orders">Orders</NavLink>
      </li>
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          id="navbarDropdown"
          href="index.html"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          { props.username }
        </a>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="navbarDropdown"
        >
          <li>
            <NavLink className="dropdown-item" to="/profile">Profile</NavLink>
          </li>
        </ul>
      </li>
      <li className="nav-item">
        <p className="nav-link logout" onClick={props.handleLogout} >Logout</p>
      </li>
    </React.Fragment>
  );
}
