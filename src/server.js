require("dotenv").config();
const express = require("express"); //commonjs
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const connection = require("./config/database");
const session = require('express-session');
const { postLoginPage, getLoginPage, getHomepage, getCategoriesPage, getDeleteCategory, getEditCategoryPage, postEditCategory, getCreateCategoryPage, postCreateCategory, getCreateProductPage, postCreateProduct, getProductsPage, getEditProductPage, postEditProduct, deleteProduct, getRegisterPage, postRegisterPage } = require("./controllers/homeController");
const { checkAuthentication } = require("./middleware/isAuthenticated");


// var cors = require("cors");

const app = express();
const port = process.env.PORT || 8888;
app.use(session({
  secret: 'lukaka',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
//config cors
// app.use(cors());
//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); 

//config template engine
configViewEngine(app);

const webAPI = express.Router();
webAPI.get("/", getLoginPage);
webAPI.post("/", postLoginPage);
webAPI.get("/homepage", checkAuthentication ,getHomepage); 
webAPI.get('/categories',checkAuthentication ,getCategoriesPage);
webAPI.post('/delete-category/:id',checkAuthentication ,getDeleteCategory);
webAPI.get("/edit-category/:id", checkAuthentication, getEditCategoryPage);
webAPI.post("/edit-category/:id", checkAuthentication, postEditCategory);
webAPI.get("/create-category", checkAuthentication, getCreateCategoryPage);
webAPI.post("/create-category", checkAuthentication, postCreateCategory);
webAPI.get("/create-product", checkAuthentication, getCreateProductPage);
webAPI.post("/create-product", checkAuthentication, postCreateProduct);
webAPI.get("/products", checkAuthentication, getProductsPage);
webAPI.get("/edit-product/:id", checkAuthentication, getEditProductPage);
webAPI.post("/edit-product/:id", checkAuthentication, postEditProduct);
webAPI.post("/delete-product/:id", checkAuthentication, deleteProduct);
webAPI.get('/register', getRegisterPage);
webAPI.post('/register', postRegisterPage);
webAPI.get('/logout', (req, res) => {
  req.session.user = null; // Xóa session người dùng
  return res.redirect('/'); // Chuyển hướng người dùng về trang đăng nhập hoặc trang chủ
});
//khai báo route
apiRoutes(app);
app.use("/", webAPI);
(async () => {
  try {
    //using mongoose
    await connection();

    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
