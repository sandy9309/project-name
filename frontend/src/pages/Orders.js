import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('user'); // 儲存使用者角色
  const navigate = useNavigate();

  const fetchOrders = () => {
    const token = localStorage.getItem('token');
    // 從 localStorage 取得目前使用者資訊以判斷角色
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUserRole(JSON.parse(savedUser).role);
    }

    fetch('http://localhost:5000/api/products/my-orders', {
      headers: { 'Authorization': token }
    })
    .then(res => res.json())
    .then(data => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    const confirmMsg = userRole === 'admin' ? "確定要刪除這筆訂單紀錄嗎？" : "確定要取消這筆代購訂單嗎？";
    if (!window.confirm(confirmMsg)) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/products/order/${orderId}`, {
      method: 'DELETE',
      headers: { 'Authorization': token }
    });

    if (res.ok) {
      alert(userRole === 'admin' ? "紀錄已移除" : "訂單已取消");
      fetchOrders(); 
    } else {
      alert("操作失敗");
    }
  };

  if (loading) return <div style={{padding: '2rem'}}>💎 正在加載清單...</div>;

  const isAdmin = userRole === 'admin';

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#92A8D1' }}>
        {isAdmin ? '👮 全體訂購管理紀錄' : '🛒 我的歷史訂單'}
      </h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: isAdmin ? '#92A8D1' : '#F7CAC9', color: 'white' }}>
            <th style={thStyle}>日期</th>
            {/* 關鍵修改：如果是管理員，顯示訂購者欄位 */}
            {isAdmin && <th style={thStyle}>訂購者 ID</th>}
            <th style={thStyle}>商品名稱</th>
            <th style={thStyle}>金額</th>
            <th style={thStyle}>操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan={isAdmin ? 5 : 4} style={{padding: '20px', textAlign: 'center'}}>尚無資料</td></tr>
          ) : (
            orders.map(order => (
              <tr key={order._id} style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{new Date(order.orderDate).toLocaleDateString()}</td>
                
                {/* 顯示訂購者 ID (僅限管理員) */}
                {isAdmin && <td style={{...tdStyle, fontSize: '0.8rem', color: '#666'}}>{order.userId}</td>}
                
                <td style={tdStyle}>{order.productName}</td>
                <td style={tdStyle}>NT$ {order.price.toLocaleString()}</td>
                <td style={tdStyle}>
                  <button 
                    onClick={() => handleDelete(order._id)}
                    style={isAdmin ? adminDelBtnStyle : delBtnStyle}
                  >
                    {isAdmin ? '強制刪除' : '取消訂單'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// 樣式區
const thStyle = { padding: '15px' };
const tdStyle = { padding: '12px' };
const delBtnStyle = { 
  backgroundColor: '#ff4d4f', 
  color: 'white', 
  border: 'none', 
  padding: '6px 12px', 
  borderRadius: '4px', 
  cursor: 'pointer' 
};
const adminDelBtnStyle = { 
  ...delBtnStyle,
  backgroundColor: '#555', // 管理員刪除按鈕用深灰色區隔
};

export default Orders;