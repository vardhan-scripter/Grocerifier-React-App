import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../Utils/Axios";
import Alert from "./Alert";
import { getStoredUserAuth } from "../Utils/GetStoredUserAuth";
import { initialNotification, notificationReducer } from "../Utils/NotificationReducer";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [notification, dispatchNotification] = useReducer(notificationReducer, initialNotification)
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getStoredUserAuth();
    if (auth !== null) {
      getAllOrders(auth.authToken);
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const getAllOrders = async (token) => {
    try {
      const response = await client.get("/api/grocery/order/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status === 200) {
        if (response.data.success && response.data.orders.length > 0) {
          const initOrders = [];
          response.data.orders.forEach((order) => {
            initOrders.push({
              orderId: order._id,
              total: order.total,
              date: new Date(order.date).toLocaleDateString(),
            });
          });
          setOrders(initOrders);
        }
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

  const navigateToOrder = (orderId) => {
    navigate(`/orders/${orderId}`, { replace: true });
  };

  return (
    <div className="container page-body">
      {notification.isRequired && (
        <Alert type={notification.type} message={notification.message} closeAlert={() => dispatchNotification({type: 'RESET'})}></Alert>
      )}
      <div className="d-flex justify-content-center">
        <div className="col-md-8">
          <div className="mb-4 mt-4">
            <h1>Order List</h1>
          </div>
          {orders.length > 0 ? (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#OrderId</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td>{order.orderId}</td>
                      <td>₹{order.total}</td>
                      <td>{order.date}</td>
                      <td>
                        <button
                          type="button"
                          className="btn"
                          onClick={() => navigateToOrder(order.orderId)}
                        >
                          <i className="fa fa-external-link"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <h6>No Orders Found!!!</h6>
          )}
        </div>
      </div>
    </div>
  );
}
