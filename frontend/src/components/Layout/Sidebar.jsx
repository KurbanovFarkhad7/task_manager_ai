//  Боковое меню

import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import logoutIcon from '../../assets/logout.png';

const Sidebar = () => {
    const { logout } = useAuth();

    return (
        <aside className="sidebar">
            <div className="logo">
                <img 
                    src={logo} 
                    alt="Logo" 
                    style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                />
                <span>Task Manager</span>
            </div>
            <nav className="menu">
                <div className="menu-item active" data-view="tasks">
                    <span className="icon"></span>
                    <span>Tasks</span>
                </div>
                <div className="menu-item" data-view="inactive">
                    <span className="icon"></span>
                    <span>Inactive</span>
                </div>
                <div className="menu-item logout" onClick={() => { logout(); window.location.href = '/auth'; }}>
                    <img 
                        src={logoutIcon} 
                        alt="Logout" 
                        style={{ width: '20px', height: '20px', objectFit: 'contain' }} 
                    />
                    <span>Log out</span>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;