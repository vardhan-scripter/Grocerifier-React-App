import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../Axios";
import Alert from "./Alert";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [completeAuth, setCompleteAuth] = useState(null);
  const [CartTotal, setCartTotal] = useState(0);
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
      if (new Date() >= new Date(authInfoJson.expiresIn)) {
        localStorage.removeItem("authInfo");
        navigate("/login", { replace: true });
      } else {
        setCompleteAuth(authInfoJson);
        getCartDetails(authInfoJson.authToken);
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

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
      setNotification({
        isRequired: true,
        type: 'danger',
        message: 'Something went wrong at server side, please try after sometime'
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
        const updatedCartItems = cartItemsList.map((item) => {
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
        setCartTotal(total);
        setCartItems(updatedCartItems);
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
  };

  const AddorRemoveFromCart = async (cartItem, operation) => {
    const url =
      operation === "Add"
        ? "http://localhost:5000/api/grocery/cart/add"
        : "http://localhost:5000/api/grocery/cart/Remove";
    if (new Date() >= new Date(completeAuth.expiresIn)) {
      localStorage.removeItem("authInfo");
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
      setNotification({
        isRequired: true,
        type: 'danger',
        message: 'Something went wrong at server side, please try after sometime'
      })
    }
  };

  const placeOrder = async () => {
    if (new Date() >= new Date(completeAuth.expiresIn)) {
      localStorage.removeItem("authInfo");
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
        setNotification({
          isRequired: true,
          type: 'success',
          message: 'Your order is successfull!!!'
        })
        setCartItems([]);
        setCartTotal(0);
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
  };

  return (
    <div className="container page-body">
      {notification.isRequired ? (
        <Alert type={notification.type} message={notification.message}></Alert>
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
