// при заходе в карточку обновляет данные
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const TaskForm = ({ task, onTaskCreated, onTaskUpdated, onDelete, onCancel }) => {
    const isEditing = !!task;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        ended_at: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                category: task.category || '',
                ended_at: task.ended_at ? task.ended_at.split('T')[0] : ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                category: '',
                ended_at: ''
            });
        }
    }, [task]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setError('Название обязательно');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isEditing) {
                // Отправляет только изменяемые поля, статус не трогает
                await api.put(`/tasks/${task.id}`, {
                    title: formData.title,
                    description: formData.description,
                    priority: formData.priority,
                    category: formData.category,
                    ended_at: formData.ended_at || null
                });
                onTaskUpdated();
            } else {
                await api.post('/tasks', {
                    title: formData.title,
                    description: formData.description,
                    priority: formData.priority,
                    category: formData.category,
                    ended_at: formData.ended_at || null
                });
                onTaskCreated();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка сохранения');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (confirm('Удалить задачу?')) {
            onDelete(task.id);
        }
    };

    return (
        <div className="modal-overlay show" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{isEditing ? 'Редактировать задачу' : 'Новая задача'}</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название задачи</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Введите название..."
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Приоритет</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Дата завершения</label>
                            <input
                                type="date"
                                name="ended_at"
                                value={formData.ended_at}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Категория</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Personal, Work, etc."
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add description..."
                            rows="3"
                        />
                    </div>

                    {isEditing && (
                        <div className="form-group">
                            <label>Дата создания</label>
                            <div className="created-at">
                                {new Date(task.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    )}

                    <div className="modal-actions">
                        {isEditing && (
                            <button type="button" className="btn-delete" onClick={handleDelete}>
                                🗑 Удалить
                            </button>
                        )}
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Отмена
                        </button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;