import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка входа');
        }
    };

    return (
        <div className="form-login">
            <div className="form-content">
                <div className="hello-white">
                    <h1>Hello!</h1>
                </div>
                <div className="white-card">
                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="forgot-row">
                            <a className="forgot-link">Forgot password?</a>
                        </div>
                        <button type="submit" className="btn-login">Login →</button>
                        <div className="create-account-row">
                            <button type="button" className="create-account-btn" onClick={onSwitchToRegister}>
                                Create account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;