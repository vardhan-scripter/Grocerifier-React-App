import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from '../Utils/Axios';
import Alert from "./Alert";
import defaultNotification from "../Utils/DefaultNotification";
import { getStoredUserAuth } from "../Utils/GetStoredUserAuth";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCart, setFilteredCart] = useState([]);
  const [completeAuth, setCompleteAuth] = useState(null);
  const [notification, setNotification] = useState(defaultNotification)

  const navigate = useNavigate();
  useEffect(() => {
    const auth = getStoredUserAuth();
    if (auth !== null) {
      setCompleteAuth(auth);
      getAllProducts(auth.authToken);
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const getAllProducts = async (token) => {
    try {
      const response = await client.get(
        "/api/grocery/all",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          }
        }
      );
  
      if (response.status === 200) {
        setProducts(response.data.Items);
        setFilteredProducts(response.data.Items);
        updateProductsWithCartDetails(response.data.Items, token);
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

  const updateProductsWithCartDetails = async (productsList, token) => {
    try {
      const response = await client.get(
        "/api/grocery/cart",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          }
        }
      );
  
      if (response.status === 200) {
        if(response.data.success){
          const initialCart = [];
            productsList.forEach(product => {
                const productExists = response.data.cart.items.filter(x => x.productId === product._id);
                if(productExists.length > 0){
                    initialCart.push({
                        productId: product._id,
                        count: productExists[0].count
                    })
                }else{
                    initialCart.push({
                        productId: product._id,
                        count: 0
                    })
                }
            });
            setCart(initialCart);
            setFilteredCart(initialCart);
        }else{
          const initialCart = [];
            productsList.forEach(product => {
                initialCart.push({
                    productId: product._id,
                    count: 0
                })
            });
            setCart(initialCart);
            setFilteredCart(initialCart);
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
  }

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
      const response = await client.post(
        url,
        cartItem,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": completeAuth.authToken,
          }
        }
      );
  
      if (response.status === 200) {
        getAllProducts(completeAuth.authToken);
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

  const addToCartTemplate = (cartDetails) => {
    if (cartDetails && cartDetails.count > 0) {
      return (
        <div className="col-md-3">
          <div className="row cart-options">
            <div className="col-md-5 pt-1">
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() =>
                    AddorRemoveFromCart({
                    ...cartDetails,
                    count: 1,
                  }, 'Remove')
                }
              >
                <i className="fa fa-minus"></i>
              </button>
            </div>
            <div className="col-md-2 p-2">
              <h6>{cartDetails.count}</h6>
            </div>
            <div className="col-md-5 pt-1">
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() =>
                    AddorRemoveFromCart({
                    ...cartDetails,
                    count: 1,
                  }, 'Add')
                }
              >
                <i className="fa fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-md-3">
          <button
            type="button"
            className="btn btn-success"
            onClick={() =>
                AddorRemoveFromCart({ ...cartDetails, count: 1 }, 'Add')
            }
          >
            Add to cart
          </button>
        </div>
      );
    }
  }

  const filterProducts = (e) => {
    const filterValue = e.target.value;
    if (filterValue.length > 0) {
      const initialProducts = [];
      const initialCart = [];
      for (let i = 0; i < products.length; i++) {
        if (
          products[i].name.toUpperCase().includes(filterValue.toUpperCase()) ||
          products[i].description.toUpperCase().includes(filterValue.toUpperCase())
        ) {
          initialProducts.push(products[i]);
          initialCart.push(cart[i]);
        }
      }
      setFilteredProducts(initialProducts);
      setFilteredCart(initialCart);
    } else {
      setFilteredProducts(products);
      setFilteredCart(cart);
    }
  }

  return (
    <div className="container page-body">
      {notification.isRequired && (
        <Alert type={notification.type} message={notification.message} closeAlert={() => setNotification(defaultNotification)}></Alert>
      )}
      <div className="col-md-8 offset-2 mt-5">
        <div className="row">
          <input
            type="text"
            className="form-control border border-dark custom-search-bar"
            placeholder="Type anything for search"
            onChange={filterProducts}
          />
        </div>
        <div className="row p-4 mt-4">
          {filteredProducts.map((product, index) => {
            return (
              <div className="card mb-3" key={product._id}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/d/dd/Parle_G_Biscuits.jpg"
                      className="img-fluid img-rounded p-3"
                      alt="Product"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      <div className="row">
                        <div className="col-md-9">
                          <h5>Price: ₹{product.price}</h5>
                          <h6>Available Count: {product.availableCount}</h6>
                          <p>Rating: {product.rating}</p>
                        </div>
                        {addToCartTemplate(filteredCart[index])}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}