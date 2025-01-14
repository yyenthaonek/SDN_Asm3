require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const white_list = ["/login", "/register", "/", "/users/generate"];
    
    // Kiểm tra xem URL có trong danh sách trắng không
    if (white_list.find(item => '/v1/api' + item === req.originalUrl)) {
        next();
    } else {
        let token = null;

        // Kiểm tra token trong headers
        if (req.headers && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]; // Lấy token từ header nếu có
        }

        // Nếu không có token trong headers, kiểm tra token trong session
        if (!token && req.session && req.session.user) {
            token = req.session.user.token; // Lấy token từ session nếu có
        }

        // Nếu không có token
        if (!token) {
            return res.status(401).json({
                message: "Bạn chưa truyền token hoặc token hết hạn"
            });
        }

        // Xác thực token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                _id: decoded._id,
                email: decoded.email,
                name: decoded.name,
                role: decoded.role
            }
            console.log("decoded", decoded);
            next();
        } catch (error) {
            return res.status(401).json({
                message: "Token bị hết hạn hoặc không hợp lệ"
            });
        }
    }
}

module.exports = auth;
