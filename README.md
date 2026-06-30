# Task Manager

<h3> Веб-приложение для управления задачами с автоматическим анализом текста. </h3>

- При создании задачи Python-сервис определяет **приоритет** и **категорию** на основе ключевых слов в названии задачи.

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone https://github.com/KurbanovFarkhad7/task_manager_ai.git
cd task_manager_ai
```

### 2. Создать файл окружения (при необходимости, если не нужен образец .env из репозитория)

```bash
cp backend/.env.example backend/.env
```

### Файл окружения (из пункта выше)

Создать файл backend/.env:
```bash
PORT=5000
DB_HOST=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432
DB_NAME=task_manager_db
JWT_SECRET=your_secret_key_here
```

### 3. Запустить Docker

```bash
docker compose up --build # При запуске в первый раз, ЛИБО ПРИ ИЗМЕНЕНИИ ПРОЕКТА

docker compose up -d # Повторно, запуск в фоне
docker compose down # Остановить
```

### 4. Открыть в браузере

http://localhost:5173

## Тестовые данные

В базе данных уже есть тестовые пользователи:

| Login | Password |
|-------|----------|
| `test@mail.ru` | `123456` |
| `admin@mail.ru` | `admin123` |

Или зарегистрируйтесь самостоятельно через форму регистрации.

## Технологический стек

### Backend

- Node.js + Express
- JWT - авторизация
- bcrypt - хеширование паролей

### Frontend

- React + Vite
- Axios - HTTP-запросы

### База данных

- PostgreSQL
- Миграции через SQL-скрипты. Существует специальный скрипт, позволяющий запускать миграции
```bash
cd backend/db/migrations
npm run migrate
```

### AI-сервис

- Python + Flask
- Анализ текста по ключевым словам

### Инфраструктура
- Docker + Docker Compose
- Контейнеризация всех сервисов (python_service, frontend, backend)

## REST API эндпоинты
### Регистрация и логин, получение токена. В результате авторизации копировать токен. Вставлять в Headers задач
| Метод | Эндпоинт | Назначение | Тело запроса |
|-------|----------|------------|--------------|
| POST | `/auth/register` | Регистрация нового пользователя | `{ "email": "test@mail.ru", "password": "123456", "first_name": "Тест", "last_name": "Тестов" }` |
| POST | `/auth/login` | Вход пользователя, получение JWT токена | `{ "email": "test@mail.ru", "password": "123456" }` |

### Задачи
| Метод | Эндпоинт | Назначение | Тело запроса |
|-------|----------|------------|--------------|
| GET | `/api/tasks` | Просмотр задач | Пусто |
| POST | `/api/tasks` | Создать новую задачу | `{ "title": "Срочно подготовить презентацию" }` |
| DELETE | `/api/tasks/:id` | Удалить задачу | Пусто |
| PUT | `/api/tasks/:id` | Обновить статус задачи | `{ "status": "done" }` |

### Python сервис
| Метод | Эндпоинт | Назначение | Тело запроса |
|-------|----------|------------|--------------|
| POST | `/analyze` | Python сервис | `{"text": "Срочно подготовить задача для бизнеса"}` |

## Анализ текста (Python)

При создании задачи текст отправляется в Python-сервис, который анализирует:
### Приоритет
| Ключевые слова | Приоритет |
|----------------|-----------|
| срочно, дедлайн, аврал, важно, до завтра | high |
| можно потом, попозже, не срочно | low |
| иначе | medium |

### Категория
| Ключевые слова | Категория |
|----------------|-----------|
| клиент, презентация, встреча, договор | business |
| купить, продукты, дома, уборка | personal |
| баг, код, frontend, backend, react | dev |
| иначе | other |

## Команды Docker
| Действие | Команда | Примечание |
|----------|---------|------------|
| Запустить все сервисы | `docker compose up -d` | Запуск в фоновом режиме |
| Запустить с пересборкой | `docker compose up -d --build` | Пересобрать образы перед запуском |
| Остановить все сервисы | `docker compose down` | Остановка контейнеров |
| Остановить и удалить БД | `docker compose down -v` | Удалить тома с данными PostgreSQL |
| Посмотреть логи | `docker compose logs -f` | Логи всех сервисов в реальном времени |


## Разработка

Запуск без Docker (для разработки)
### 1. База данных
```bash
psql -U postgres -f backend/db/dump.sql
```
### 2. Backend
Необходимо редактировать .env файл, заменив строку, указав localhost вместо postgre
DB_HOST=localhost
```bash
cd backend
npm install
npm run dev # http://localhost:5000
```
### 3. Python сервис
```bash
cd python_service
pip install -r requirements.txt
python app.py # http://localhost:5001
```
Также редактировать routes/tasks.js, изменив URL контейнера на локальный
'http://python-ai:5001/analyze' на 'http://localhost:5001/analyze'
Пересобрать проект
```bash
docker compose up --build
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev # http://localhost:5173
```

## Структура проекта (что делает каждый файл)

### Backend (Node.js + Express)
| Файл | Назначение |
|------|------------|
| `backend/index.js` | Точка входа. Настраивает Express сервер, middleware, подключает маршруты. |
| `backend/routes/auth.js` | Регистрация и логин пользователя. Генерация JWT токена. |
| `backend/routes/tasks.js` | CRUD операции с задачами (создание, получение, обновление статуса, удаление). Интеграция с Python-сервисом. |
| `backend/middleware/auth.js` | Проверка JWT токена. Защищает маршруты от неавторизованного доступа. |
| `backend/db/pool.js` | Подключение к PostgreSQL. Использует переменные из .env. |
| `backend/db/dump.sql` | Дамп базы данных. Содержит структуру таблиц и тестовые данные. |
| `backend/db/migrations/` | SQL-скрипты для миграций базы данных. |
| `backend/package.json` | Зависимости Node.js и скрипты для запуска. |
| `backend/.env` | Переменные окружения. |
| `backend/Dockerfile` | Инструкция для сборки Docker-образа бэкенда. |

### Frontend (React + Vite)
| Файл | Назначение |
|------|------------|
| `frontend/src/main.jsx` | Точка входа React. Рендерит корневой компонент. |
| `frontend/src/App.jsx` | Корневой компонент. Настраивает маршрутизацию и контекст авторизации. |
| `frontend/src/pages/Auth.jsx` | Страница авторизации (логин и регистрация). |
| `frontend/src/pages/Dashboard.jsx` | Главная страница. Содержит Kanban-доску. |
| `frontend/src/components/Auth/Login.jsx` | Форма входа. Отправляет запрос на `/auth/login`. |
| `frontend/src/components/Auth/Register.jsx` | Форма регистрации. Отправляет запрос на `/auth/register`. |
| `frontend/src/components/Tasks/KanbanBoard.jsx` | Kanban-доска с колонками. Управляет загрузкой, фильтрацией и Drag-and-Drop. |
| `frontend/src/components/Tasks/TaskCard.jsx` | Карточка задачи. Отображает название, приоритет, категорию, дату и описание. |
| `frontend/src/components/Tasks/TaskForm.jsx` | Модальное окно для создания и редактирования задачи. |
| `frontend/src/components/Layout/Sidebar.jsx` | Боковое меню с логотипом, навигацией и кнопкой выхода. |
| `frontend/src/context/AuthContext.jsx` | Контекст авторизации. Хранит пользователя, токен, предоставляет функции login, register, logout. |
| `frontend/src/api/axios.js` | Настройка Axios. Автоматически добавляет JWT токен в заголовки. |
| `frontend/src/styles/` | CSS стили для компонентов. |
| `frontend/package.json` | Зависимости React и скрипты для запуска. |
| `frontend/Dockerfile` | Инструкция для сборки Docker-образа фронтенда. |

### Python AI-сервис
| Файл | Назначение |
|------|------------|
| `python_service/app.py` | Flask сервер. Принимает текст задачи, анализирует по ключевым словам, возвращает приоритет и категорию. |
| `python_service/requirements.txt` | Зависимости Python (flask, flask-cors). |
| `python_service/Dockerfile` | Инструкция для сборки Docker-образа Python-сервиса. |

### Конфигурация и инфраструктура
| Файл | Назначение |
|------|------------|
| `docker-compose.yml` | Оркестрация контейнеров: PostgreSQL, Python-сервис, Backend, Frontend. |
| `.gitignore` | Список файлов и папок, которые не попадают в Git (node_modules, .env, и т.д.). |
| `README.md` | Документация проекта: описание, структура, инструкция по запуску. |


## Лицензия

Проект выполнен в рамках учебной практики.
Не для коммерческого использования.