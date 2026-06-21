-- Миграция: Изменение типа ended_at с TIMESTAMP на DATE

-- Up migration
BEGIN;

-- Создаем временную колонку с новым типом
ALTER TABLE tasks ADD COLUMN ended_at_new DATE;

-- Перести данные с преобразованием нужно
UPDATE tasks SET ended_at_new = ended_at::DATE;
-- Удаить старую колонку
ALTER TABLE tasks DROP COLUMN ended_at;
-- новую колонку нужно переименовать
ALTER TABLE tasks RENAME COLUMN ended_at_new TO ended_at;

-- Создает индекс на новой колонке
CREATE INDEX idx_tasks_ended_at ON tasks(ended_at);

COMMIT;

-- Down: Откат изменений
-- BEGIN;
-- ALTER TABLE tasks ADD COLUMN ended_at_old TIMESTAMP;
-- UPDATE tasks SET ended_at_old = ended_at::TIMESTAMP;
-- ALTER TABLE tasks DROP COLUMN ended_at;
-- ALTER TABLE tasks RENAME COLUMN ended_at_old TO ended_at;
-- DROP INDEX IF EXISTS idx_tasks_ended_at;
-- CREATE INDEX idx_tasks_ended_at ON tasks(ended_at);
-- COMMIT;