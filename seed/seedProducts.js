// Load environment variables (so we can use MONGO_URI)
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");

// Instead of hardcoding products, we fetch real sample data (with real
// images) from DummyJSON's public API and re-shape it to match our own
// Product schema (name, price, description, stock, category, imageUrl).
const fetchProductsFromDummyJSON = async () => {
  const res = await fetch("https://dummyjson.com/products?limit=30");
  if (!res.ok) throw new Error(`DummyJSON fetch failed: ${res.status}`);
  const data = await res.json();

  return data.products.map((p) => ({
    name: p.title,
    price: p.price,
    description: p.description,
    stock: p.stock,
    category: p.category,
    imageUrl: p.thumbnail,
  }));
};

// This function does the actual seeding work
const seedDatabase = async () => {
  try {
    // Connect directly to MongoDB (separate from server.js's connection,
    // since this script runs on its own, not as part of the running server)
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Remove any existing products first, so we don't get duplicates
    // every time we run this script
    await Product.deleteMany({});
    console.log("Existing products cleared");

  // Fetch real product data (with real images) and insert it
    const products = await fetchProductsFromDummyJSON();
    await Product.insertMany(products);
    console.log(`${products.length} products inserted successfully`);

    // Close the connection and exit the script cleanly
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();