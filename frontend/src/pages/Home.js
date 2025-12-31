import React, { useState, useEffect } from 'react';

function Home({ user }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleOrder = (productId) => {
    if (!user) {
      alert("⚠️ 請先登入帳號後再進行訂購！");
      window.location.href = '/login';
      return;
    }
    
    // 如果有登入，呼叫後端訂購 API
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/products/order', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token 
      },
      body: JSON.stringify({ productId })
    })
    .then(res => res.json())
    .then(data => alert(data.message));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>💎 SEVENTEEN 周邊代購清單</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {products.map(p => (
          <div key={p._id} style={cardStyle}>
            <h3>{p.name}</h3>
            <p>價格: ${p.price}</p>
            <p>狀態: {p.status}</p>
            <button onClick={() => handleOrder(p._id)}>立即訂購</button>
            {/* 隱藏功能：只有 admin 才能看到刪除按鈕 */}
            {user?.role === 'admin' && <button style={{color: 'red'}}>下架商品</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = { border: '1px solid #92A8D1', padding: '1rem', borderRadius: '8px' }; // 寧靜藍

export default Home;