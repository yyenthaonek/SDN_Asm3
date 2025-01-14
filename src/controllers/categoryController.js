const {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService
} = require("../services/categoryService");

// Category Controller
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  // Kiểm tra xem các trường có hợp lệ hay không
  if (!name || !description) {
    return res.status(400).json({ success: false, message: "Name and description are required" });
  }

  const data = await createCategoryService(name, description);

  if (data.EC === 1) {
    return res.status(400).json({ success: false, message: data.EM });
  }

  return res.status(201).json({ success: true, data: data.result });
};

const getCategories = async (req, res) => {
  const data = await getCategoriesService();
  return res.status(200).json({ success: true, data: data.categories });
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const data = await getCategoryByIdService(id);

  if (data.EC === 1) {
    return res.status(404).json({ success: false, message: data.EM });
  }

  return res.status(200).json({ success: true, data: data.category });
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Kiểm tra xem id và dữ liệu cập nhật có hợp lệ hay không
  if (!id || !updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, message: "Category ID and updates are required" });
  }

  const data = await updateCategoryService(id, updates);

  if (data.EC === 1) {
    return res.status(404).json({ success: false, message: data.EM });
  }

  return res.status(200).json({ success: true, data: data.category });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Category ID is required" });
  }

  const data = await deleteCategoryService(id);

  if (data.EC === 1) {
    return res.status(404).json({ success: false, message: data.EM });
  }

  return res.status(200).json({ success: true, message: data.EM });
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
