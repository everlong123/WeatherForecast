import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { setAuthToken, setUser } from '../utils/auth';
import { FiCloud, FiSun, FiDroplet } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: '',
    district: '',
    ward: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login({
          username: formData.username,
          password: formData.password,
        });
      } else {
        response = await authAPI.register(formData);
      }

      setAuthToken(response.data.token);
      setUser(response.data);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      setError(errorMessage);
      
      // Log chi tiết để debug
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      } else if (err.request) {
        console.error('No response received. Is backend running?');
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="weather-icon-cloud">
          <FiCloud />
        </div>
        <div className="weather-icon-sun">
          <FiSun />
        </div>
        <div className="weather-icon-rain">
          <FiDroplet />
        </div>
      </div>
      
      <div className="login-card fade-in">
        <div className="login-header">
          <h1>🌦️ Weather Alert</h1>
          <p>{isLogin ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản mới'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                className="input"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
              />
            </>
          )}
          
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
            className="input"
          />
          
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />

          {!isLogin && (
            <>
              <input
                type="text"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                className="input"
              />
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={formData.address}
                onChange={handleChange}
                className="input"
              />
              <input
                type="text"
                name="district"
                placeholder="Quận/Huyện"
                value={formData.district}
                onChange={handleChange}
                className="input"
              />
              <input
                type="text"
                name="ward"
                placeholder="Phường/Xã"
                value={formData.ward}
                onChange={handleChange}
                className="input"
              />
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="toggle-link"
          >
            {isLogin
              ? 'Chưa có tài khoản? Đăng ký ngay'
              : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

