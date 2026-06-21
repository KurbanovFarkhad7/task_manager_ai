import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Register = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        middle_name: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => onSwitchToLogin(), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
        }
    };

    return (
        <div className="form-register">
            <div className="form-content">
                <div className="hello-white">
                    <h1>Create account</h1>
                </div>
                <div className="white-card">
                    <form className="register-form" onSubmit={handleSubmit}>
                        {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
                        {success && <div style={{ color: 'green', fontSize: '14px' }}>Аккаунт создан! Войдите.</div>}
                        
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label htmlFor="last_name">Last name</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    placeholder="Last name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="first_name">First name</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    placeholder="First name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="middle_name">Middle name</label>
                            <input
                                type="text"
                                id="middle_name"
                                placeholder="Middle name"
                                value={formData.middle_name}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="btn-register">Create</button>
                        <div className="login-switch-row">
                            <button type="button" className="login-switch-btn" onClick={onSwitchToLogin}>
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;