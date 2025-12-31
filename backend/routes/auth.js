// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // 用來加密密碼
const jwt = require('jsonwebtoken');

// [註冊邏輯]
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // 加密密碼，不要直接存明文
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "註冊成功！請登入" });
    } catch (err) {
        res.status(400).json({ message: "註冊失敗，帳號可能已被使用" });
    }
});

// [登入邏輯]
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "帳號不存在" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "密碼錯誤" });

    // 發放 JWT 通行證 (Token)
    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );
    res.json({ token, username: user.username, role: user.role });
});

module.exports = router;