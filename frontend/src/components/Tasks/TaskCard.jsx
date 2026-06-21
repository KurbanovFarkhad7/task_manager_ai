// карточка задачи

const PRIORITY_CLASSES = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low'
};

const TaskCard = ({ task, onEdit, onDragStart }) => {
    // Ограничение описания до 50 символов
    const shortDescription = task.description && task.description.length > 50 
        ? task.description.slice(0, 50) + '...' 
        : task.description;

    return (
        <div
            className="task-card"
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            onClick={() => onEdit(task)}
        >
            <div className="task-name">{task.title}</div>
            
            <div className="task-meta">
                <span className={`task-priority ${PRIORITY_CLASSES[task.priority] || 'priority-medium'}`}>
                    {task.priority?.toUpperCase() || 'MEDIUM'}
                </span>
                {task.ended_at && (
                    <span className="task-date">
                        📅 {new Date(task.ended_at).toISOString().split('T')[0]}
                    </span>
                )}
                {task.category && (
                    <span className="task-category">{task.category}</span>
                )}
            </div>

            {shortDescription && (
                <div className="task-description">{shortDescription}</div>
            )}
        </div>
    );
};

export default TaskCard;