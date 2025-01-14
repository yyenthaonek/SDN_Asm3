const Product = require("../models/Product");
const Category = require("../models/Category");

// Create a product
const createProductService = async (name, description, price, categoryId) => {
  // Kiểm tra hợp lệ của các trường dữ liệu
  if (!name || !description || !price || !categoryId) {
    return { EC: 1, EM: "Name, description, price, and category ID are required" };
  }

  // Kiểm tra xem danh mục có tồn tại không
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists || categoryExists.is_deleted) {
    return { EC: 1, EM: "Category does not exist" };
  }

  try {
    const product = await Product.create({ name, description, price, category: categoryId, is_deleted: false });
    return { EC: 0, result: product };
  } catch (error) {
    console.error(error);
    return { EC: 1, EM: "An error occurred while creating the product" };
  }
};

// Get all products
const getProductsService = async () => {
  try {
    const products = await Product.find({ is_deleted: false }).populate("category");
    return { EC: 0, products };
  } catch (error) {
    console.error(error);
    return { EC: 1, EM: "An error occurred while retrieving products" };
  }
};

// Get product by ID
const getProductByIdService = async (id) => {
  try {
    const product = await Product.findById(id).populate("category");
    if (!product || product.is_deleted) {
      return { EC: 1, EM: "Product not found" };
    }
    return { EC: 0, product };
  } catch (error) {
    console.error(error);
    return { EC: 1, EM: "An error occurred while retrieving the product" };
  }
};

// Update product
const updateProductService = async (id, updates) => {
  try {
    // Kiểm tra xem sản phẩm có tồn tại không
   

    const product = await Product.findById(id);
    
    if (!product || product.is_deleted) {
      return { EC: 1, EM: "Product not found" };
    }

    // Kiểm tra nếu có cập nhật categoryId thì phải kiểm tra xem category đó có tồn tại hay không
    if (updates.category) {
      const categoryExists = await Category.findById(updates.category);
      if (!categoryExists || categoryExists.is_deleted) {
        return { EC: 1, EM: "Category does not exist" };
      }
    }

    // Cập nhật sản phẩm
    Object.assign(product, updates);
    await product.save();
    return { EC: 0, product };
  } catch (error) {
    console.error(error);
    return { EC: 1, EM: "An error occurred while updating the product" };
  }
};

// Delete product
const deleteProductService = async (id) => {
  // Kiểm tra xem id có hợp lệ hay không
  if (!id) {
    return { EC: 1, EM: "Product ID is required" };
  }

  try {
    const product = await Product.findById(id);
    if (!product || product.is_deleted) {
      return { EC: 1, EM: "Product not found or already deleted" };
    }

    product.is_deleted = true;
    await product.save();
    return { EC: 0, EM: "Product deleted successfully" };
  } catch (error) {
    console.error(error);
    return { EC: 1, EM: "An error occurred while deleting the product" };
  }
};


module.exports = {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService
};
