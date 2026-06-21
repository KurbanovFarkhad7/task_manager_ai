import { useState, useEffect } from 'react';
import api from '../../api/axios';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import '../../styles/kanban.css';

const STATUSES = ['New', 'Active', 'Done', 'Inactive'];
const STATUS_MAP = {
    'New': 'new',
    'Active': 'active',
    'Done': 'done',
    'Inactive': 'inactive'
};

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (err) {
            setError('Ошибка загрузки задач');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (taskId) => {
        if (!confirm('Удалить задачу?')) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            fetchTasks();
            setEditingTask(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    const handleTaskSaved = () => {
        setShowForm(false);
        setEditingTask(null);
        fetchTasks();
    };

    // Drag-and-Drop
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, status) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== status) {
            const apiStatus = STATUS_MAP[status];
            await handleStatusChange(taskId, apiStatus);
        }
    };

    if (loading) return <div className="loading">Загрузка задач...</div>;
    if (error) return <div className="error-msg">{error}</div>;

    return (
        <div className="kanban-container">
            <div className="top-bar">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Search..." />
                </div>
                <div className="filter-sort">
                    <select className="priority-filter">
                        <option value="all">Priority: All</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <button className="btn-add" onClick={() => {
                        setEditingTask(null);
                        setShowForm(true);
                    }}>
                        + Add New
                    </button>
                </div>
            </div>

            {showForm && (
                <TaskForm
                    task={editingTask}
                    onTaskCreated={handleTaskSaved}
                    onTaskUpdated={handleTaskSaved}
                    onDelete={handleDelete}
                    onCancel={handleFormClose}
                />
            )}

            <div className="board">
                {STATUSES.map(status => {
                    const apiStatus = STATUS_MAP[status];
                    const statusTasks = tasks.filter(t => t.status === apiStatus);
                    return (
                        <div key={status} className="column">
                            <div className="column-header">
                                <div className="column-title">
                                    {status}
                                    <span className="count">{statusTasks.length}</span>
                                </div>
                            </div>
                            <div
                                className="column-body"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, status)}
                            >
                                {statusTasks.length === 0 ? (
                                    <div className="empty-state">Нет задач</div>
                                ) : (
                                    statusTasks.map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onEdit={handleEdit}
                                            onDragStart={handleDragStart}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KanbanBoard;