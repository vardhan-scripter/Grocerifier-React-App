import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../Axios";

export default function Order() {
  const [completeAuth, setCompleteAuth] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const authInfo = localStorage.getItem("authInfo");
    if (authInfo !== null) {
      const authInfoJson = JSON.parse(authInfo);
      if (new Date() >= new Date(authInfoJson.expiresIn)) {
        localStorage.removeItem("authInfo");
        navigate("/login", { replace: true });
      } else {
        setCompleteAuth(authInfoJson);
        getOrderDetails(params.orderId, authInfoJson.authToken);
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [params]);

  const getOrderDetails = async (orderId, token) => {
    try {
      const response = await client.get(`/api/grocery/order/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status === 200) {
        if (response.data.success && response.data.order) {
          updateOrderItemsWithProductDetails(response.data.order.items, token);
        }
      } else {
        throw response.err;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateOrderItemsWithProductDetails = async (orderItemsList, token) => {
    try {
      const response = await client.get("/api/grocery/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status === 200) {
        const products = response.data.Items;
        let total = 0;
        const updatedOrderItems = orderItemsList.map((item) => {
          const product = products.filter((x) => x._id === item.productId);
          if (product.length > 0) {
            total += product[0].price * item.count;
            return {
              ...item,
              name: product[0].name,
              description: product[0].description,
              price: product[0].price,
              amount: product[0].price * item.count,
            };
          }
        });
        setOrderTotal(total);
        setOrders(updatedOrderItems);
      } else {
        throw response.err;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container page-body">
      <div className="d-flex justify-content-center">
        <div className="col-md-8">
          <div className="mb-4 mt-4">
            <h1>Order Details</h1>
          </div>
          {orders.length > 0 ? (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Count</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td>{order.name}</td>
                      <td>{order.description}</td>
                      <td>{order.count}</td>
                      <td>{order.price}</td>
                      <td>{order.amount}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <h6>Order Total</h6>
                  </td>
                  <td>
                    <h6>{orderTotal}</h6>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <h6>No Order Items Found for this order!!!</h6>
          )}
        </div>
      </div>
    </div>
  );
}
