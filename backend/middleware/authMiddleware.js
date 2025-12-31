const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "未登入，請先登入帳號" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 將解析出來的使用者資訊放入 request
        next(); // 通過，可以繼續後續操作
    } catch (err) {
        res.status(401).json({ message: "通行證無效" });
    }
};