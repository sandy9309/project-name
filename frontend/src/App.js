import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

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
        <Link to="/">💎 FollowOurStar</Link>
        <div>
          {user ? (
            <>
              <span>你好, {user.username} ({user.role})</span>
              <button onClick={logout}>登出</button>
            </>
          ) : (
            <>
              <Link to="/login">登入</Link>
              <Link to="/register">註冊</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#F7CAC9' }; // 克拉粉

export default App;