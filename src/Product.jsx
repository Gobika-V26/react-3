
import { useState, useEffect } from "react";

function Product({ productName, price }) {
  // State to maintain the current price
  const [currentPrice, setCurrentPrice] = useState(price);

  // Runs when the component mounts
  useEffect(() => {
    console.log("Shopping Cart System Loaded");
  }, []);

  // Apply ₹200 discount
  function applyDiscount() {
    setCurrentPrice((previousPrice) =>
      Math.max(0, previousPrice - 200)
    );
  }

  return (
    <div className="product-card">
      <h2>Product Details</h2>

      <p>
        <strong>Product Name:</strong> {productName}
      </p>

      <p>
        <strong>Original Price:</strong> ₹{price}
      </p>

      <h3>Current Price: ₹{currentPrice}</h3>

      <button onClick={applyDiscount}>
        Apply ₹200 Discount
      </button>
    </div>
  );
}

export default Product;
