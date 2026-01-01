import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders'; // 1. 引入訂單頁面

function App() {
  const [user, setUser] = useState(null);

  // 初始化：檢查瀏覽器是否存有登入資訊
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <nav style={navStyle}>
        <div>
          <Link to="/" style={logoStyle}>💎 FollowOurStar</Link>
          {/* 只有登入後才顯示「我的訂單」連結 */}
          {user && <Link to="/my-orders" style={linkStyle}>我的訂單</Link>}
        </div>
        
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '15px' }}>嗨, {user.username} ({user.role})</span>
              <button onClick={logout} style={logoutBtnStyle}>登出</button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>登入</Link>
              <Link to="/register" style={linkStyle}>註冊</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        {/* 2. 增加訂單頁面的路徑 */}
        <Route path="/my-orders" element={<Orders />} />
      </Routes>
    </Router>
  );
}

// 樣式設定
const navStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  padding: '1rem 2rem', 
  background: '#F7CAC9', // 克拉粉
  alignItems: 'center' 
};

const logoStyle = { 
  fontSize: '1.5rem', 
  fontWeight: 'bold', 
  textDecoration: 'none', 
  color: '#fff', 
  marginRight: '20px' 
};

const linkStyle = { 
  textDecoration: 'none', 
  color: '#555', 
  marginLeft: '15px',
  fontWeight: '500'
};

const logoutBtnStyle = {
  backgroundColor: '#92A8D1', // 寧靜藍
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default App;