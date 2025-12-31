db = db.getSiblingDB('follow_our_star');

// 建立初始商品
db.createCollection('products');
db.products.insertMany([
  {
    name: "SVT 官方應援燈 Ver.3",
    category: "應援物",
    price: 1350,
    stock: 17,
    status: "現貨",
    createdAt: new Date()
  },
  {
    name: "SEVENTEEN '17 IS RIGHT HERE' 專輯",
    category: "專輯",
    price: 650,
    stock: 100,
    status: "預購",
    createdAt: new Date()
  }
]);

// 建立預設管理員與使用者
db.createCollection('users');
db.users.insertMany([
  {
    username: "admin_carat",
    password: "svt20150526", // 提醒：實務上這應該是加密過的
    role: "admin",
    email: "admin@svt.com"
  },
  {
    username: "carat_01",
    password: "password123",
    role: "user",
    email: "user@svt.com"
  }
]);