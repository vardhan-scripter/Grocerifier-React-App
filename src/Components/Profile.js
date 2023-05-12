import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [allValues, setAllValues] = useState({
    email: "",
    username: "",
    name: "",
    gender: "",
    address1: "",
    address2: "",
  });

  const changeHandler = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  useEffect(() => {
    const authInfo = localStorage.getItem("authInfo");
    if (authInfo !== null) {
      const authInfoJson = JSON.parse(authInfo);
      if (new Date() >= new Date(authInfoJson.expiresIn)) {
        localStorage.removeItem("authInfo");
        navigate("/login", { replace: true });
      } else {
        fetchUserDetails(authInfoJson.authToken);
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  const fetchUserDetails = (token) => {
    fetch("http://localhost:5000/api/user", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        setAllValues({
          email: response.email ?? "",
          username: response.username ?? "",
          name: response.name ?? "",
          gender: response.gender ?? "",
          address1: response.address1 ?? "",
          address2: response.address2 ?? "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveUserDetails = (token) => {
    fetch("http://localhost:5000/api/user/update", {
      body: JSON.stringify(allValues),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then((response) => {
        setAllValues({
          email: response.email ?? "",
          username: response.username ?? "",
          name: response.name ?? "",
          gender: response.gender ?? "",
          address1: response.address1 ?? "",
          address2: response.address2 ?? "",
        });
        alert("User details updated successfully!!!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const authInfo = localStorage.getItem("authInfo");
    if (authInfo !== null) {
      const authInfoJson = JSON.parse(authInfo);
      if (new Date() >= new Date(authInfoJson.expiresIn)) {
        localStorage.removeItem("authInfo");
        navigate("/login", { replace: true });
      } else {
        saveUserDetails(authInfoJson.authToken);
      }
    } else {
      navigate("/login", { replace: true });
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className="container d-flex justify-content-center">
        <div className="col-md-4 vertical-center">
          <div className="text-center mb-4">
            <h1>User Profile</h1>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <h6>Email: </h6>
            </div>
            <div className="col-md-8">
              <input
                type="email"
                name="email"
                className="form-control"
                value={allValues.email}
                disabled
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <h6>Name: </h6>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                name="name"
                className="form-control"
                value={allValues.name}
                onChange={changeHandler}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <h6>Gender: </h6>
            </div>
            <div className="col-md-8">
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={changeHandler}
                checked={allValues.gender === "male"}
              />
              <label>Male</label>
              <span className="space"></span>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={changeHandler}
                checked={allValues.gender === "female"}
              />
              <label>Female</label>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <h6>Primary Address: </h6>
            </div>
            <div className="col-md-8">
              <textarea
                name="address1"
                id="address1"
                cols="10"
                rows="3"
                className="form-control"
                value={allValues.address1}
                onChange={changeHandler}
                required
              ></textarea>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <h6>Secondary Address: </h6>
            </div>
            <div className="col-md-8">
              <textarea
                name="address2"
                id="address2"
                cols="10"
                rows="3"
                className="form-control"
                value={allValues.address2}
                onChange={changeHandler}
              ></textarea>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <Link type="button" className="btn btn-danger" to="/dashboard">
                Cancel
              </Link>
            </div>
            <div className="col-md-8 justify-content-end d-flex">
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
