const Category = require("../models/Category");
const Product = require("../models/Product");
// Create a category
const createCategoryService = async (name, description) => {
  // Kiểm tra hợp lệ của các trường dữ liệu
  if (!name || !description) {
    return { EC: 1, EM: "Name and description are required" };
  }

  // Kiểm tra xem danh mục đã tồn tại chưa
  const existingCategory = await Category.findOne({ name, is_deleted: false });
  if (existingCategory) {
    return { EC: 1, EM: "Category already exists" };
  }

  try {
    const category = await Category.create({ name, description, is_deleted: false });
    return { EC: 0, result: category };
  } catch (error) {
    console.error(error);
    return { EC: 1, EM: "An error occurred while creating the category" };
  }
};

// Get all categories
const getCategoriesService = async () => {
  try {
    const categories = await Category.find({ is_deleted: false });
    
    return { EC: 0, categories };
  } catch (error) {
    console.error(error);
    return { EC: 1, EM: "An error occurred while retrieving categories" };
  }
};

// Get category by ID
const getCategoryByIdService = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category || category.is_deleted) {
      return { EC: 1, EM: "Category not found" };
    }
    return { EC: 0, category };
  } catch (error) {
    console.error(error);
    return { EC: 1, EM: "An error occurred while retrieving the category" };
  }
};

// Update category
const updateCategoryService = async (id, updates) => {
  // Kiểm tra xem id có hợp lệ hay không
  if (!id) {
    return { EC: 1, EM: "Category ID is required" };
  }

  // Kiểm tra hợp lệ của các trường dữ liệu cần cập nhật
  if (!updates || Object.keys(updates).length === 0) {
    return { EC: 1, EM: "Updates are required" };
  }

  try {
    const category = await Category.findById(id);
    if (!category || category.is_deleted) {
      return { EC: 1, EM: "Category not found" };
    }

    // Kiểm tra xem danh mục khác có cùng tên với tên mới đang cập nhật không
    if (updates.name) {
      const existingCategory = await Category.findOne({ name: updates.name, is_deleted: false });
      if (existingCategory && existingCategory._id.toString() !== id) {
        return { EC: 1, EM: "Category with this name already exists" };
      }
    }

    Object.assign(category, updates);
    await category.save();
    return { EC: 0, category };
  } catch (error) {
    console.error(error);
    return { EC: 1, EM: "An error occurred while updating the category" };
  }
};


// Delete category
const deleteCategoryService = async (id) => {
  // Kiểm tra xem id có hợp lệ hay không
  if (!id) {
    return { EC: 1, EM: "Category ID is required" };
  }

  try {
    // Kiểm tra xem danh mục có tồn tại không
    const category = await Category.findById(id);
    if (!category || category.is_deleted) {
      return { EC: 1, EM: "Category not found or already deleted" };
    }

    // Tìm tất cả các sản phẩm liên quan đến danh mục này
    const associatedProducts = await Product.find({ category: id, is_deleted: false });

    // Đánh dấu các sản phẩm liên quan là đã xóa (is_deleted = true)
    await Product.updateMany({ category: id }, { is_deleted: true });

    // Đánh dấu danh mục là đã xóa (is_deleted = true)
    category.is_deleted = true;
    await category.save();

    return { EC: 0, EM: `Category and ${associatedProducts.length} related products deleted successfully` };
  } catch (error) {
    console.error(error);
    return { EC: 1, EM: "An error occurred while deleting the category and related products" };
  }
};



module.exports = {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService
};
