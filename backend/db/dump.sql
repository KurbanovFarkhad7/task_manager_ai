-- ЧИСТЫЙ ДАМП для Docker контейнера
-- Только таблицы и данные, без CREATE ROLE/DATABASE

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Создание таблиц 

CREATE TABLE IF NOT EXISTS public.migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    applied_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;

CREATE TABLE IF NOT EXISTS public.tasks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'new'::character varying,
    priority character varying(20) DEFAULT 'medium'::character varying,
    category character varying(50) DEFAULT 'other'::character varying,
    ended_at date,
    CONSTRAINT tasks_priority_check CHECK (((priority)::text = ANY ((ARRAY['high'::character varying, 'medium'::character varying, 'low'::character varying])::text[]))),
    CONSTRAINT tasks_status_check CHECK (((status)::text = ANY ((ARRAY['new'::character varying, 'active'::character varying, 'done'::character varying, 'inactive'::character varying])::text[])))
);

CREATE SEQUENCE IF NOT EXISTS public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;

CREATE TABLE IF NOT EXISTS public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    last_name character varying(50) NOT NULL,
    first_name character varying(50) NOT NULL,
    middle_name character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

-- Defaults

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

-- Индексы 

CREATE INDEX IF NOT EXISTS idx_tasks_ended_at ON public.tasks USING btree (ended_at);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks USING btree (status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks USING btree (user_id);

-- Constraints 
ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- ДАННЫЕ --

-- ПОЛЬЗОВАТЕЛИ 
INSERT INTO public.users (id, email, password_hash, last_name, first_name, middle_name, created_at) VALUES
(1, 'admin@mail.ru', '$2b$10$5w8ZQNpLxqN9ZqLxqN9ZqLxqN9ZqLxqN9ZqLxqN9ZqLxqN9ZqLxqN9ZqL', 'Админ', 'Админский', 'Админович', '2026-06-02 03:21:02.539757'),
(2, 'user@mail.ru', '$2b$10$7xYzA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6', 'Юзер', 'Юзеров', 'Юзерович', '2026-06-02 03:21:02.539757'),
(3, 'alex@example.com', '$2y$10$hash_example', 'Козлов', 'Алексей', 'Дмитриевич', '2026-06-02 03:21:02.539757'),
(4, 'ivan@example.com', '$2b$10$tT1CDFXT5CYx5z2vVCPFguPtkIdiDMUmeIIrBYNF5icJ34u5vI7ma', 'Петров', 'Иван', 'Иванович', '2026-06-05 02:17:06.145338'),
(5, 'test@mail.ru', '$2b$10$FYzp1gIJdIq/4tBKfrjgA.CKhdMlw6uCibpfHzYIV1DpxkrgfhKgG', 'Тестов', 'Тест', NULL, '2026-06-13 20:19:44.970467'),
(6, 'man@mail.ru', '$2b$10$l8zS7L2uzlGGkIqgi3bgLO2NfVBnPcz8z0fDzXSwMjDJK/4vSWkAS', 'man', 'manovich', 'manskiy', '2026-06-21 15:13:59.788506')
ON CONFLICT (id) DO NOTHING;

-- ---------- ЗАДАЧИ ----------
INSERT INTO public.tasks (id, user_id, title, description, created_at, status, priority, category, ended_at) VALUES
(1, 1, 'Купить продукты', 'Хлеб, молоко, яйца', '2026-06-02 03:21:15.430498', 'done', 'medium', 'other', NULL),
(2, 1, 'Сдать отчёт', 'Подготовить квартальный отчёт', '2026-06-02 03:21:15.430498', 'done', 'medium', 'other', '2024-06-01'),
(3, 2, 'Позвонить клиенту', 'Обсудить условия договора', '2026-06-02 03:21:15.430498', 'active', 'medium', 'other', NULL),
(4, 2, 'Заплатить налоги', 'До 25 числа', '2026-06-02 03:21:15.430498', 'done', 'medium', 'games', NULL),
(5, 3, 'Обновить сайт', 'Сверстать новую главную страницу', '2026-06-02 03:21:15.430498', 'new', 'medium', 'other', '2024-05-28'),
(6, 5, 'Сделать домашку по React', 'Закончить до пятницы', '2026-06-13 20:44:04.790668', 'new', 'medium', 'other', '2026-06-30'),
(12, 5, 'Срочно подготовить презентацию для клиента', '', '2026-06-21 14:39:12.037884', 'new', 'high', 'business', '2026-07-03'),
(13, 5, 'Срочно сделать тест', '', '2026-06-21 14:45:09.182869', 'active', 'high', 'other', '2026-06-18'),
(14, 5, 'Test', '123', '2026-06-22 20:09:09.134679', 'active', 'low', 'other', '2026-06-24')
ON CONFLICT (id) DO NOTHING;

-- МИГРАЦИИ
INSERT INTO public.migrations (id, name, applied_at) VALUES
(1, '20260620_add_inactive_status.sql', '2026-06-21 14:25:51.939043'),
(2, '20260622_change_ended_at_to_date.sql', '2026-06-21 14:25:51.953093')
ON CONFLICT (id) DO NOTHING;

-- Сброс последовательностей 

SELECT pg_catalog.setval('public.users_id_seq', COALESCE((SELECT MAX(id) FROM public.users), 1), true);
SELECT pg_catalog.setval('public.tasks_id_seq', COALESCE((SELECT MAX(id) FROM public.tasks), 1), true);
SELECT pg_catalog.setval('public.migrations_id_seq', COALESCE((SELECT MAX(id) FROM public.migrations), 1), true);