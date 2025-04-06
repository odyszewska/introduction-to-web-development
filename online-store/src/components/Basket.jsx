import React from "react";
import { useBasket } from "./BasketContext";
import "./styles/Basket.css"; // Import the CSS file

const Basket = () => {
  const { basket, updateQuantity, removeFromBasket, clearBasket } = useBasket();

  return (
    <div className="basket-page">
      <h1>Basket</h1>
      {basket.length === 0 ? (
        <p className="empty-basket">Your basket is empty.</p>
      ) : (
        <div className="basket-content">
          <ul className="basket-items">
            {basket.map((item) => (
              <li key={item.id} className="basket-item">
                <img src={item.image} alt={item.title} className="basket-item-image" />
                <div className="basket-item-details">
                  <p className="basket-item-title">{item.title}</p>
                  <p className="basket-item-price">${item.price.toFixed(2)}</p>
                  <div className="basket-item-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromBasket(item.id)}
                    className="remove-item-button"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button className="checkout-button" onClick={clearBasket}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Basket;