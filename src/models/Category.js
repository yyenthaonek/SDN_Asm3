const mongoose = require("mongoose");

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
