const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order'); 
const auth = require('../middleware/authMiddleware');

// 1. [Read] 獲取商品列表 (自動計算銷量與剩餘庫存)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean();
        const productsWithStats = await Promise.all(products.map(async (product) => {
            const soldCount = await Order.countDocuments({ productId: product._id });
            return {
                ...product,
                totalSold: soldCount,
                remainingStock: (product.stock || 0) - soldCount 
            };
        }));
        res.json(productsWithStats);
    } catch (err) {
        res.status(500).json({ message: "抓取商品失敗" });
    }
});

// 2. [Create Order] 使用者訂購
router.post('/order', auth, async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "找不到該商品" });
        }

        const soldCount = await Order.countDocuments({ productId: product._id });
        if ((product.stock || 0) - soldCount <= 0) {
            return res.status(400).json({ message: "⚠️ 該商品已售罄，無法訂購！" });
        }

        const newOrder = new Order({
            userId: req.user.id,        
            productId: product._id,
            productName: product.name,  
            price: product.price
        });

        await newOrder.save();
        res.json({ message: "💎 訂購成功！已加入您的歷史清單。" });
    } catch (err) {
        res.status(500).json({ message: "訂購程序出錯" });
    }
});

// 3. [Read Orders] 取得訂單清單 (管理員看全部 / 使用者看自己)
router.get('/my-orders', auth, async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.find().sort({ orderDate: -1 });
        } else {
            orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 });
        }
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "無法取得訂單清單" });
    }
});

// 4. [Admin Create] 管理者上架商品 (Create)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "權限不足" });
    }
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: '商品上架成功！', newProduct });
    } catch (err) {
        res.status(400).json({ message: "上架失敗" });
    }
});

// 5. [Admin Update] 管理者更新商品庫存 (Update)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "權限不足" });
    }
    try {
        const { stock } = req.body;
        // 使用 findByIdAndUpdate 修改特定的 stock 欄位
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            { $set: { stock: parseInt(stock) } }, 
            { new: true } // 返回修改後的數據
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ message: "找不到該商品" });
        }
        
        res.json({ message: '✨ 庫存總量已成功更新！', updatedProduct });
    } catch (err) {
        res.status(400).json({ message: "更新失敗" });
    }
});

// 6. [Admin Delete] 管理者下架商品 (Delete)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "權限不足" });
    }
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: '商品已成功移除' });
    } catch (err) {
        res.status(400).json({ message: "刪除失敗" });
    }
});

// 7. [Delete Order] 取消/刪除訂單
router.delete('/order/:orderId', auth, async (req, res) => {
    try {
        let order;
        if (req.user.role === 'admin') {
            order = await Order.findById(req.params.orderId);
        } else {
            order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id });
        }

        if (!order) {
            return res.status(404).json({ message: "找不到該訂單或您無權操作" });
        }

        await Order.findByIdAndDelete(req.params.orderId);
        res.json({ message: "❌ 訂單紀錄已移除" });
    } catch (err) {
        res.status(500).json({ message: "操作失敗" });
    }
});

module.exports = router;