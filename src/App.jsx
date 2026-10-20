
import Product from "./Product";

function App() {
  return (
    <div>
      <h1>Shopping Cart Management System</h1>

      <Product
        productName="Wireless Headphones"
        price={1500}
      />
    </div>
  );
}

export default App;
