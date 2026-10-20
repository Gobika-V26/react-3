
import express from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();

app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let productsCollection;

// Home route
app.get("/", (req, res) => {
  res.send("Shopping Cart API is running");
});

// Retrieve all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await productsCollection.find({}).toArray();
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Retrieve a product by productId
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await productsCollection.findOne({
      productId: req.params.id
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Insert a product
app.post("/api/products", async (req, res) => {
  try {
    const { productId, productName, price, category } = req.body;

    if (
      productId == null ||
      !productName ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !category
    ) {
      return res.status(400).json({
        message:
          "Provide productId, productName, a valid price, and category"
      });
    }

    const existingProduct = await productsCollection.findOne({
      productId: String(productId)
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "Product ID already exists"
      });
    }

    const result = await productsCollection.insertOne({
      productId: String(productId),
      productName,
      price,
      category
    });

    res.status(201).json({
      message: "Product added successfully",
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error("Error inserting product:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from the .env file");
    }

    // Connect to MongoDB
    await client.connect();
    console.log("MongoDB connected successfully");

    // Select the database and collection
    const database = client.db("shoppingCartDB");
    productsCollection = database.collection("products");

    // Test read access
    const count = await productsCollection.countDocuments();
    console.log("Existing product count:", count);

    // Insert sample products only when the collection is empty
    if (count === 0) {
      await productsCollection.insertMany([
        {
          productId: "P101",
          productName: "Wireless Headphones",
          price: 1500,
          category: "Electronics"
        },
        {
          productId: "P102",
          productName: "Smart Watch",
          price: 2500,
          category: "Electronics"
        },
        {
          productId: "P103",
          productName: "School Bag",
          price: 800,
          category: "Accessories"
        }
      ]);

      console.log("Sample products inserted");
    }

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    console.error(
      "Check your ByteXL MongoDB connection and database permissions."
    );

    await client.close().catch(() => {});
    process.exitCode = 1;
  }
}

startServer();
