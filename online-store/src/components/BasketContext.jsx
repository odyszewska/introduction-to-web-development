import React, { createContext, useState, useContext } from "react";

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  // Add product to basket
  const addToBasket = (product, quantity = 1) => {
    setBasket((prevBasket) => {
      const existingProduct = prevBasket.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevBasket.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevBasket, { ...product, quantity }];
    });

    // Update stock in localStorage
    const updatedStock = product.stock - quantity;
    localStorage.setItem(`stock_${product.id}`, updatedStock);
  };

  // Update product quantity
const updateQuantity = (id, newQuantity) => {
  setBasket((prevBasket) => {
    return prevBasket.map((item) => {
      if (item.id === id) {
        const currentStock = parseInt(localStorage.getItem(`stock_${id}`), 10) || item.stock;
        const basketQuantity = prevBasket.reduce((acc, basketItem) => {
          return basketItem.id === id ? acc + basketItem.quantity : acc;
        }, 0);
        const availableStock = currentStock + item.quantity; // Restore stock of the current item in basket

        if (newQuantity > 0 && newQuantity <= availableStock) {
          const quantityChange = newQuantity - item.quantity;
          const updatedStock = currentStock - quantityChange;

          // Update stock in localStorage
          localStorage.setItem(`stock_${id}`, updatedStock);

          return { ...item, quantity: newQuantity };
        } else {
          console.warn(
            `Invalid quantity: must be greater than 0 and less than or equal to available stock (${availableStock}).`
          );
          return item;
        }
      }
      return item;
    });
  });
};


  // Remove product from basket
  const removeFromBasket = (id) => {
    setBasket((prevBasket) => {
      const productToRemove = prevBasket.find((item) => item.id === id);
      if (productToRemove) {
        const updatedStock =
          parseInt(localStorage.getItem(`stock_${id}`), 10) +
          productToRemove.quantity;
        localStorage.setItem(`stock_${id}`, updatedStock);
      }
      return prevBasket.filter((item) => item.id !== id);
    });
  };

  // Clear entire basket
  const clearBasket = () => {
    setBasket((prevBasket) => {
      prevBasket.forEach((item) => {
      });
      return [];
    });
  };

  return (
    <BasketContext.Provider
      value={{ basket, addToBasket, updateQuantity, removeFromBasket, clearBasket }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => useContext(BasketContext);