import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBasket } from "./BasketContext";
import { useUser } from "./UserContext";
import "./styles/ProductPage.css"; // Import the CSS file

const ProductPage = () => {
  const { productId } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); // Reviews for the product
  const [newReview, setNewReview] = useState({
    content: "",
    stars: 5,
  });
  const [quantity, setQuantity] = useState(1); // Quantity of product to add
  const [notification, setNotification] = useState(""); // Notification for added to basket
  const { addToBasket } = useBasket();
  const { user } = useUser();

  useEffect(() => {
    // Fetch product details and sync with localStorage
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${productId}`
        );
        const data = await response.json();

        // Check stock in localStorage
        const storedStock = localStorage.getItem(`stock_${data.id}`);
        const stock = storedStock ? parseInt(storedStock) : 20; // Default stock: 20

        setProduct({ ...data, stock });

        // Load reviews from API and localStorage
        const apiReviews = [
          { username: "JohnDoe", content: "Great product!", stars: 5 },
          { username: "JaneSmith", content: "Good value for the price.", stars: 4 },
        ];
        const storedReviews = localStorage.getItem(`reviews_${data.id}`);
        const localReviews = storedReviews ? JSON.parse(storedReviews) : [];

        // Filter out duplicate reviews based on username and content
        const combinedReviews = [...apiReviews];
        localReviews.forEach((localReview) => {
          if (!combinedReviews.some(
            (review) =>
              review.username === localReview.username &&
              review.content === localReview.content
          )) {
            combinedReviews.push(localReview);
          }
        });

        setReviews(combinedReviews);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToBasket = () => {
    if (product.stock >= quantity) {
      addToBasket({ ...product, quantity });
      const updatedStock = product.stock - quantity;
      setProduct({ ...product, stock: updatedStock });
      localStorage.setItem(`stock_${product.id}`, updatedStock);

      // Show notification
      setNotification(`${quantity} x ${product.title} has been added to your basket.`);
      setTimeout(() => setNotification(""), 3000); // Hide notification after 3 seconds
    }
  };

  const handleReviewSubmit = () => {
    if (!user) {
      alert("You need to be logged in to leave a review.");
      return;
    }

    if (!newReview.content) {
      alert("Please write your review before submitting.");
      return;
    }

    const updatedReviews = [
      ...reviews,
      { username: user.username, ...newReview },
    ];
    setReviews(updatedReviews);
    setNewReview({ content: "", stars: 5 });

    // Save updated reviews to localStorage
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updatedReviews));
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > product.stock) {
      alert("Not enough stock available.");
      setQuantity(product.stock);
    } else if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-page">
      <h1>{product.title}</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <img
          src={product.image}
          alt={product.title}
        />
        <div>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </p>
          <p className={`stock ${product.stock === 0 ? "out-of-stock" : ""}`}>
            {product.stock === 0 ? "Out of Stock" : `In Stock: ${product.stock}`}
          </p>
          <div className="buttons">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToBasket}
            disabled={product.stock === 0 || quantity <= 0}
          >
            Add to Basket
          </button>
        </div>
      </div>

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      <div className="reviews">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>
                <p>
                  <strong>{review.username}:</strong> {review.content}
                </p>
                <p>Rating: {"⭐".repeat(review.stars)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet. Be the first to leave one!</p>
        )}

        <div className="review-form">
          <h3>Leave a Review</h3>
          <textarea
            placeholder="Your Review"
            value={newReview.content}
            onChange={(e) =>
              setNewReview({ ...newReview, content: e.target.value })
            }
          ></textarea>

          <label>
            Rating: {" "}
            <select
              value={newReview.stars}
              onChange={(e) =>
                setNewReview({ ...newReview, stars: parseInt(e.target.value) })
              }
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </label>
          <br />
          <button onClick={handleReviewSubmit}>
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;