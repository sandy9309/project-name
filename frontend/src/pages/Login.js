import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        
        if (res.ok) {
            // 關鍵：儲存 Token 和 使用者資訊
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }));
            
            setUser({ username: data.username, role: data.role }); // 更新 App.js 的狀態
            alert(`歡迎回來, ${data.username}!`);
            navigate('/'); // 登入成功回首頁
        } else {
            alert(data.message);
        }
    };

    return (
        <div style={formContainer}>
            <h2>💎 克拉會員登入</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="密碼" onChange={e => setFormData({...formData, password: e.target.value})} required />
                <button type="submit" style={{backgroundColor: '#92A8D1', color: 'white', border: 'none', padding: '10px'}}>登入</button>
            </form>
        </div>
    );
}

const formContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' };

export default Login;