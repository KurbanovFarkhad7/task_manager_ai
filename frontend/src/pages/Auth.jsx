// перенос компонентов на страницы

import { useState } from 'react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import '../styles/auth.css';

const Auth = () => {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className="card" id="mainCard">
            <div className={`card-left ${showRegister ? 'hidden' : ''}`} id="leftPanel">
                <div className="app-title">Task Manager</div>
                <div className="logo-center">
                    <img src="src/assets/logo.png" alt="Task Manager Logo" />
                    <div className="sub-message">Login your account to create tasks</div>
                </div>
                <div className="portfolio-tag">Portfolio project. Non commercial</div>
            </div>
            <div className={`card-right ${showRegister ? 'expanded' : ''}`} id="rightPanel">
                <div className="form-slider-wrapper">
                    <div className={`form-slider ${showRegister ? 'shifted' : ''}`} id="formSlider">
                        <Login onSwitchToRegister={() => setShowRegister(true)} />
                        <Register onSwitchToLogin={() => setShowRegister(false)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;