import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (res.ok) {
            alert("註冊成功！請登入");
            navigate('/login'); // 註冊完自動跳轉到登入頁
        } else {
            alert(data.message);
        }
    };

    return (
        <div style={formContainer}>
            <h2>💎 加入 FollowOurStar</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input type="text" placeholder="使用者名稱" onChange={e => setFormData({...formData, username: e.target.value})} required />
                <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="密碼" onChange={e => setFormData({...formData, password: e.target.value})} required />
                <button type="submit">立即註冊</button>
            </form>
        </div>
    );
}

const formContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' };

export default Register;