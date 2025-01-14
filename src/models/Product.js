const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  is_deleted: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
