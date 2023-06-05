import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../Utils/Axios";
import Alert from "./Alert";
import { getStoredUserAuth } from "../Utils/GetStoredUserAuth";
import { initialNotification, notificationReducer } from "../Utils/NotificationReducer";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [completeAuth, setCompleteAuth] = useState(null);
  const [CartTotal, setCartTotal] = useState(0);
  const [notification, dispatchNotification] = useReducer(notificationReducer, initialNotification);

  const navigate = useNavigate();
  useEffect(() => {
    const auth = getStoredUserAuth();
    if (auth !== null) {
      setCompleteAuth(auth);
      getCartDetails(auth.authToken);
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const getCartDetails = async (token) => {
    try {
      const response = await client.get("/api/grocery/cart", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });

      if (response.status === 200) {
        if(response.data.success) {
          updateCartWithProductDetails(response.data.cart.items, token);
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

  const updateCartWithProductDetails = async (cartItemsList, token) => {
    try {
      const response = await client.get("/api/grocery/all", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });

      if (response.status === 200) {
        const products = response.data.Items;
        let total = 0;
        const updatedCartItems = cartItemsList
          .filter(
            (item) =>
              products.filter((x) => x._id === item.productId).length > 0
          )
          .map((item) => {
            const product = products.filter((x) => x._id === item.productId);
            total += product[0].price * item.count;
            return {
              ...item,
              name: product[0].name,
              description: product[0].description,
              price: product[0].price,
              amount: product[0].price * item.count,
            };
          });
        setCartTotal(total);
        setCartItems(updatedCartItems);
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

  const AddorRemoveFromCart = async (cartItem, operation) => {
    const url =
      operation === "Add"
        ? "http://localhost:5000/api/grocery/cart/add"
        : "http://localhost:5000/api/grocery/cart/Remove";
    if (new Date() >= new Date(completeAuth.expiresIn)) {
      localStorage.removeItem("UserAuth");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await client.post(url, cartItem, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": completeAuth.authToken,
        },
      });

      if (response.status === 200) {
        getCartDetails(completeAuth.authToken);
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

  const placeOrder = async () => {
    if (new Date() >= new Date(completeAuth.expiresIn)) {
      localStorage.removeItem("UserAuth");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await client.post(
        "/api/grocery/order",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": completeAuth.authToken,
          },
        }
      );

      if (response.status === 200) {
        dispatchNotification({
          type: 'SUCCESS',
          payload: 'Your order is successfull!, Please wait we are redirecting to you order'
        })
        setCartItems([]);
        setCartTotal(0);
        setTimeout(() => {
          navigate(`/orders/${response.data.orderId}`, { replace: true });
        }, 1000);
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

  return (
    <div className="container page-body">
      {notification.isRequired ? (
        <Alert type={notification.type} message={notification.message} closeAlert={() => dispatchNotification({type: 'RESET'})}></Alert>
      ) : null}
      <div className="d-flex justify-content-center">
        <div className="col-md-8">
          <div className="mb-4 mt-4">
            <h1>Cart Details</h1>
          </div>
          {cartItems.length > 0 ? (
            <>
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
                  {cartItems.map((cartItem, index) => {
                    return (
                      <tr key={index}>
                        <td>{cartItem.name}</td>
                        <td>{cartItem.description}</td>
                        <td>
                          <div className="cart-options">
                            <button
                              type="button"
                              className="btn btn-outline-success"
                              onClick={() =>
                                AddorRemoveFromCart(
                                  {
                                    productId: cartItem.productId,
                                    count: 1,
                                  },
                                  "Remove"
                                )
                              }
                            >
                              <i className="fa fa-minus"></i>
                            </button>
                            <p>{cartItem.count}</p>
                            <button
                              type="button"
                              className="btn btn-outline-success"
                              onClick={() =>
                                AddorRemoveFromCart(
                                  {
                                    productId: cartItem.productId,
                                    count: 1,
                                  },
                                  "Add"
                                )
                              }
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td>₹{cartItem.price}</td>
                        <td>₹{cartItem.amount}</td>
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
                      <h6>₹{CartTotal}</h6>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mb-4 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-success button-right"
                  onClick={placeOrder}
                >
                  Proceed with Order
                </button>
              </div>
            </>
          ) : (
            <h6>No Cart Items Found!!! Please select any</h6>
          )}
        </div>
      </div>
    </div>
  );
}
