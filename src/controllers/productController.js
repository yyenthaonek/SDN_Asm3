const {
    createProductService,
    getProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService
  } = require("../services/productService");
  
  // Product Controller
  const createProduct = async (req, res) => {
    const { name, description, price, categoryId } = req.body;
  
    // Kiểm tra xem các trường có hợp lệ hay không
    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ success: false, message: "Name, description, price, and category ID are required" });
    }
  
    const data = await createProductService(name, description, price, categoryId);
  
    if (data.EC === 1) {
      return res.status(400).json({ success: false, message: data.EM });
    }
  
    return res.status(201).json({ success: true, data: data.result });
  };
  
  const getProducts = async (req, res) => {
    const data = await getProductsService();
    return res.status(200).json({ success: true, data: data.products });
  };
  
  const getProductById = async (req, res) => {
    const { id } = req.params;
    const data = await getProductByIdService(id);
  
    if (data.EC === 1) {
      return res.status(404).json({ success: false, message: data.EM });
    }
  
    return res.status(200).json({ success: true, data: data.product });
  };
  
  const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    // Kiểm tra xem id và dữ liệu cập nhật có hợp lệ hay không
    if (!id || !updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "Product ID and updates are required" });
    }
  
    const data = await updateProductService(id, updates);
  
    if (data.EC === 1) {
      return res.status(404).json({ success: false, message: data.EM });
    }
  
    return res.status(200).json({ success: true, data: data.product });
  };
  
  const deleteProduct = async (req, res) => {
    const { id } = req.params;
  
    // Kiểm tra xem id có hợp lệ hay không
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
  
    const data = await deleteProductService(id);
  
    if (data.EC === 1) {
      return res.status(404).json({ success: false, message: data.EM });
    }
  
    return res.status(200).json({ success: true, message: data.EM });
  };
  
  module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
  };
  