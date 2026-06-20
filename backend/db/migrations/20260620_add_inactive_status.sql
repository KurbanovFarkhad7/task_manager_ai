-- Добавление новых состояний для таблицы задач. Было new, done

-- Up migration
BEGIN;

-- Удаляет старое ограничение
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;

-- Создает новое с добавленными статусами
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
CHECK (status IN ('new', 'active', 'done', 'inactive'));

COMMIT;

-- Down migration (для отката)
-- BEGIN;
-- ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
-- ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
-- CHECK (status IN ('new', 'in_progress', 'done'));
-- COMMIT;