import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBasket } from "./BasketContext";
import "./styles/Main.css";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [notification, setNotification] = useState("");
  const { addToBasket } = useBasket();

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        
        const enrichedData = data.map((product) => {
          const storedStock = localStorage.getItem(`stock_${product.id}`);
          const stock = storedStock ? parseInt(storedStock) : 20;
          return { ...product, stock };
        });
        
        setProducts(enrichedData);
        setFilteredProducts(enrichedData);

        const initialQuantities = {};
        enrichedData.forEach((product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const results = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleQuantityChange = (id, value) => {
    const stock = products.find((product) => product.id === id).stock;
    if (value >= 1 && value <= stock) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: value,
      }));
    }
  };

  const incrementQuantity = (id) => {
    const stock = products.find((product) => product.id === id).stock;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.min((prevQuantities[id] || 1) + 1, stock),
    }));
  };

  const decrementQuantity = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max((prevQuantities[id] || 1) - 1, 1),
    }));
  };

  const handleAddToBasket = (product) => {
    const quantity = quantities[product.id] || 1;
    const updatedProducts = products.map((p) =>
      p.id === product.id
        ? { ...p, stock: p.stock - quantity }
        : p
    );
    
    localStorage.setItem(`stock_${product.id}`, updatedProducts.find(p => p.id === product.id).stock);

    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);

    addToBasket(product, quantity);
    setNotification(`${quantity} x ${product.title} has been added to the basket.`);
    setTimeout(() => setNotification(""), 1000);
  };

  return (
    <div className="main-page">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.title}
              />
              <h3>
                <Link to={`/product/${product.id}`}>
                  {product.title}
                </Link>
              </h3>

              <p className="product-price">
                ${product.price.toFixed(2)}
              </p>
              <p className={`product-stock ${product.stock === 0 ? "out-of-stock" : ""}`}>
                {product.stock === 0
                  ? "Out of Stock"
                  : `In Stock: ${product.stock}`}
              </p>
              <div className="quantity-controls">
                <button
                  onClick={() => decrementQuantity(product.id)}
                  disabled={product.stock === 0}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantities[product.id] || 1}
                  min="1"
                  max={product.stock}
                  onChange={(e) =>
                    handleQuantityChange(product.id, parseInt(e.target.value))
                  }
                  disabled={product.stock === 0}
                />
                <button
                  onClick={() => incrementQuantity(product.id)}
                  disabled={product.stock === 0}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleAddToBasket(product)}
                disabled={product.stock === 0}
                className="add-to-basket"
              >
                Add to Basket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Main;