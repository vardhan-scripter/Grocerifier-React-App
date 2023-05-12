import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
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
    fetch("http://localhost:5000/api/grocery/all", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        setProducts(response.Items);
        updateProductsWithCartDetails(response.Items, token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateProductsWithCartDetails = (productsList, token) => {
    fetch("http://localhost:5000/api/grocery/cart", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success){
            const initialCart = [];
            productsList.forEach(product => {
                const productExists = response.cart.items.filter(x => x.productId === product._id);
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
            console.log(initialCart);
        }else{
            const initialCart = [];
            products.forEach(product => {
                initialCart.push({
                    productId: product._id,
                    count: 0
                })
            });
            setCart(initialCart);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const AddorRemoveFromCart = (cartItem, operation) => {
    const url =
      operation === "Add"
        ? "http://localhost:5000/api/grocery/cart/add"
        : "http://localhost:5000/api/grocery/cart/Remove";
    if (new Date() >= new Date(completeAuth.expiresIn)) {
      localStorage.removeItem("authInfo");
      navigate("/login", { replace: true });
      return;
    }

    fetch(url, {
        body: JSON.stringify(cartItem),
        headers: {
          "Content-Type": "application/json",
          "Authorization": completeAuth.authToken,
        },
        method: "POST",
      })
        .then((response) => response.json())
        .then((response) => {
          getAllProducts(completeAuth.authToken);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const addToCartTemplate = (cartDetails) => {
    if (cartDetails && cartDetails.count > 0) {
      return (
        <div className="col-md-4">
          <div className="row cart-options">
            <div className="col-md-5">
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
            <div className="col-md-5">
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
        <div className="col-md-4">
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

  return (
    <div className="container">
      <div className="col-md-8 offset-2 mt-5">
        <div className="row">
          <input
            type="text"
            className="form-control border border-dark custom-search-bar"
            placeholder="Type anything for search"
          />
        </div>
        <div className="row p-4 mt-4">
          {products.map((product, index) => {
            return (
              <div className="card mb-3" key={index}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/2/27/Happy_Faces_Biscuit.jpg"
                      className="img-fluid rounded-start p-3"
                      alt="Product"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      <div className="row">
                        <div className="col-md-8">
                            <h5>Price: ${product.price}</h5>
                          <h6>Available Count: {product.availableCount}</h6>
                          <p>Rating: {product.rating}</p>
                        </div>
                        { addToCartTemplate(cart[index]) }
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
