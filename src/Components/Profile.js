import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../Utils/Axios";
import Alert from "./Alert";
import { getStoredUserAuth } from "../Utils/GetStoredUserAuth";
import { initialNotification, notificationReducer } from "../Utils/NotificationReducer";

export default function Profile() {
  const [allValues, setAllValues] = useState({
    email: '',
    username: '',
    name: '',
    gender: '',
    address1: '',
    address2: ''
  });
  const [notification, dispatchNotification] = useReducer(notificationReducer, initialNotification)

  const changeHandler = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  useEffect(() => {
    const auth = getStoredUserAuth();
    if (auth !== null) {
      fetchUserDetails(auth.authToken);
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const fetchUserDetails = async (token) => {
    try {
      const response = await client.get("api/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status === 200) {
        setAllValues({
          email: response.data.email ?? "",
          username: response.data.username ?? "",
          name: response.data.name ?? "",
          gender: response.data.gender ?? "",
          address1: response.data.address1 ?? "",
          address2: response.data.address2 ?? "",
        });
      } else {
        throw response.err;
      }
    } catch {
      dispatchNotification({
        type: 'DANGER',
        payload: 'Something went wrong at server side, please try after sometime'
      })
    }
  };

  const saveUserDetails = async (token) => {
    try {
      const response = await client.post("/api/user/update", allValues, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status === 200) {
        setAllValues({
          email: response.data.email ?? "",
          username: response.data.username ?? "",
          name: response.data.name ?? "",
          gender: response.data.gender ?? "",
          address1: response.data.address1 ?? "",
          address2: response.data.address2 ?? "",
        });
        dispatchNotification({
          type: 'SUCCESS',
          payload: 'User details updated successfully!!!'
        })
      } else {
        throw response.err;
      }
    } catch {
      dispatchNotification({
        type: 'DANGER',
        payload: 'Something went wrong at server side, please try after sometime'
      })
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const authInfo = localStorage.getItem("UserAuth");
    if (authInfo !== null) {
      const authInfoJson = JSON.parse(authInfo);
      if (new Date() >= new Date(authInfoJson.expiresIn)) {
        localStorage.removeItem("UserAuth");
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
      {notification.isRequired && (
        <Alert type={notification.type} message={notification.message} closeAlert={() => dispatchNotification({type: 'RESERT'})}></Alert>
      )}
      <div className="container d-flex justify-content-center page-body">
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
