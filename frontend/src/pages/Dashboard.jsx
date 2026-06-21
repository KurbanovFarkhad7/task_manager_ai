import Sidebar from '../components/Layout/Sidebar';
import KanbanBoard from '../components/Tasks/KanbanBoard';
import '../styles/dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main">
                <KanbanBoard />
            </main>
        </div>
    );
};

export default Dashboard;