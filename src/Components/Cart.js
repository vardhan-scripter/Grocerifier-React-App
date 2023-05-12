import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart(){
  const [cartItems, setCartItems] = useState([]);
  const [completeAuth, setCompleteAuth] = useState(null);
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
        getAllProducts(authInfoJson.authToken);
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  const getAllProducts = (token) => {
    fetch("http://localhost:5000/api/grocery/cart", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if(response.success){
          updateCartWithProductDetails(response.cart.items, token);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateCartWithProductDetails = (cartItemsList, token) => {
    fetch("http://localhost:5000/api/grocery/all", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        const products = response.Items;
        const updatedCartItems = cartItemsList.map(item => {
          const product = products.filter(x => x._id === item.productId);
          if(product.length > 0){
            return {
              ...item,
              name: product[0].name,
              description: product[0].description,
              price: product[0].price,
              amount: product[0].price * item.count
            };
          }
        })
        setCartItems(updatedCartItems);
      })
      .catch((err) => {
        console.log(err);
      });
  }    

    return (
      <div className="container pagecontent">
        <div className="d-flex justify-content-center">
          <div className="col-md-8">
            <div className="mb-4 mt-4">
              <h1>Cart Details</h1>
            </div>
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
                        >
                          <i className="fa fa-minus"></i>
                        </button>
                        <p>{cartItem.count}</p>
                        <button
                          type="button"
                          className="btn btn-outline-success"
                        >
                          <i className="fa fa-plus"></i>
                        </button>
                      </div>
                    </td>
                    <td>{cartItem.price}</td>
                    <td>{cartItem.amount}</td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}