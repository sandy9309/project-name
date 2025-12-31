// backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware'); // 引入權限保鏢

// 1. [Read] 所有人都能看商品 (不需登入)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "抓取商品失敗" });
    }
});

// 2. [Create Order] 使用者訂購 (需登入)
router.post('/order', auth, async (req, res) => {
    // 這裡可以延伸：將訂單存入 Order Collection
    console.log(`使用者 ${req.user.id} 正在訂購商品: ${req.body.productId}`);
    res.json({ message: "訂購成功！我們會盡快處理您的代購需求。" });
});

// 3. [Admin Create] 管理者上架商品 (需登入 + 是 Admin)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "權限不足，僅限管理員上架商品" });
    }
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: '商品上架成功！', newProduct });
    } catch (err) {
        res.status(400).json({ message: "上架失敗，請檢查資料格式" });
    }
});

// 4. [Admin Delete] 管理者下架商品 (需登入 + 是 Admin)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "權限不足，僅限管理員下架商品" });
    }
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: '商品已成功移除' });
    } catch (err) {
        res.status(400).json({ message: "刪除失敗，找不到該商品" });
    }
});

module.exports = router;