
const { getCategoriesService, deleteCategoryService, updateCategoryService, getCategoryByIdService, createCategoryService } = require("../services/categoryService");
const { getProductsService, getProductByIdService, updateProductService, deleteProductService, createProductService } = require("../services/productService");
const { createUserService, loginService } = require("../services/userService");


const getLoginPage = async (req, res) => {
    return res.render('pageLogin.ejs');
};


const postLoginPage = async (req, res) => {
    const { email, password } = req.body;

    try {
        const data = await loginService(email, password);
        console.log("? > ",data);
        // Kiểm tra kết quả từ loginService và xử lý theo mã lỗi
        if (data.EC === 1 || data.EC === 2) {
            return res.status(400).json({
                success: false,
                message: data.EM, // Thông báo lỗi từ service
                errors: [],
            });
        }

        if (data.EC === 3 || data.EC === 4) {
            return res.status(403).json({
                success: false,
                message: data.EM, // Thông báo lỗi quyền hạn hoặc xác thực
                errors: [],
            });
        }

        // Lưu thông tin người dùng và token vào session
        req.session.user = {
            _id: data.user._id,
            email: data.user.email,
            token: data.accessToken,
        };
        console.log("Login successful");
        // Đăng nhập thành công, chuyển hướng về trang chủ
        return res.redirect('/homepage');
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send('An error occurred during login');
    }
};
const postRegisterPage = async (req, res) => {
    const { name, email, password, role } = req.body; // Lấy thêm name từ form

    try {
        const result = await createUserService(name, email, '', '', password, role); // Truyền name vào service
        if (result.EC === 0) {
            return res.redirect('/homepage'); // Chuyển hướng sau khi đăng ký thành công
        } else {
            return res.status(400).send(result.EM);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).send('An error occurred during registration');
    }
};
const getRegisterPage = async (req, res) => {
    return res.render('register.ejs')
}

const getHomepage = async (req, res) => {
    return res.render('homepage.ejs')
}
const getCategoriesPage = async (req, res) => {
    try {
        console.log("Get categories page");
        const result = await getCategoriesService();
        
        if (result.EC === 0) {
            return res.render('category.ejs', { categories: result.categories });
        } else {
            return res.status(500).send(result.EM);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error retrieving categories');
    }
};


const getDeleteCategory = async (req, res) => {
    const { id } = req.params;  
    if (!id) {
        console.log("Category ID is missing");
        return res.status(400).send("Category ID is missing");
    }

    try {
        const result = await deleteCategoryService(id);  // Gọi service xóa category
        console.log(result.EM);  // In ra console thông báo từ service

        if (result.EC === 0) {
            return res.redirect('/categories');  // Nếu xóa thành công, chuyển hướng về trang danh sách categories
        } else {
            return res.status(400).send(result.EM);  // Nếu có lỗi, trả về thông báo lỗi
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).send("An error occurred while deleting the category");
    }
};

  
const getEditCategoryPage = async (req, res) => {
    const { id } = req.params;
   
    try {
        const result = await getCategoryByIdService(id);

        if (result.EC === 0) {
            return res.render('editCategory.ejs', { category: result.category });
        } else {
            return res.status(404).send(result.EM);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error retrieving category for editing');
    }
};

const postEditCategory = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const result = await updateCategoryService(id, updates);

        if (result.EC === 0) {
            return res.redirect('/categories');
        } else {
            return res.status(400).send(result.EM);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error updating category');
    }
};
const getCreateCategoryPage = async (req, res) => {
    return res.render('createCategory.ejs');
};

const postCreateCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const result = await createCategoryService(name, description);

        if (result.EC === 0) {
            return res.redirect('/categories');  // Nếu tạo thành công, chuyển hướng về danh sách category
        } else {
            return res.status(400).send(result.EM);  // Nếu có lỗi, hiển thị thông báo lỗi
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while creating the category');
    }
};
const getCreateProductPage = async (req, res) => {
    try {
        // Lấy danh sách category từ service
        const result = await getCategoriesService();
        if (result.EC === 0) {
            return res.render('createProduct.ejs', { categories: result.categories });
        } else {
            return res.status(500).send(result.EM);
        }
    } catch (error) {
        console.error("Error retrieving categories:", error);
        return res.status(500).send("An error occurred while retrieving categories");
    }
};

const postCreateProduct = async (req, res) => {
    const { name, description, price, categoryId } = req.body;

    try {
        const result = await createProductService(name, description, price, categoryId);

        if (result.EC === 0) {
            return res.redirect('/products');  // Nếu tạo thành công, chuyển hướng về danh sách product
        } else {
            return res.status(400).send(result.EM);  // Nếu có lỗi, hiển thị thông báo lỗi
        }
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).send('An error occurred while creating the product');
    }
};
const getProductsPage = async (req, res) => {
    try {
        const result = await getProductsService();
        if (result.EC === 0) {
            return res.render('products.ejs', { products: result.products });
        } else {
            return res.status(500).send(result.EM);
        }
    } catch (error) {
        console.error("Error retrieving products:", error);
        return res.status(500).send("An error occurred while retrieving products");
    }
};

const getEditProductPage = async (req, res) => {
    const { id } = req.params;
    try {
        const productResult = await getProductByIdService(id);
        const categoryResult = await getCategoriesService();

        if (productResult.EC === 0 && categoryResult.EC === 0) {
            return res.render('editProduct.ejs', { product: productResult.product, categories: categoryResult.categories });
        } else {
            return res.status(404).send(productResult.EM || categoryResult.EM);
        }
    } catch (error) {
        console.error("Error retrieving product for editing:", error);
        return res.status(500).send("An error occurred while retrieving the product for editing");
    }
};

const postEditProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const result = await updateProductService(id, updates);
        if (result.EC === 0) {
            return res.redirect('/products');
        } else {
            return res.status(400).send(result.EM);
        }
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).send("An error occurred while updating the product");
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteProductService(id);
        if (result.EC === 0) {
            return res.redirect('/products');
        } else {
            return res.status(400).send(result.EM);
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).send("An error occurred while deleting the product");
    }
};
module.exports = {
    postLoginPage,
    postRegisterPage,
    getRegisterPage,
    deleteProduct,
    postEditProduct,
    getEditProductPage,
    getProductsPage,
    getCreateProductPage,
    postCreateProduct,
    getCreateCategoryPage,
    postCreateCategory,
    getEditCategoryPage,
    postEditCategory,
    getDeleteCategory,
    getCategoriesPage,
    getLoginPage,
    getHomepage,

}