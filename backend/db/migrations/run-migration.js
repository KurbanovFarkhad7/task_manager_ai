// скрипт для запуска миграций, запускать в backend/db npm run migrate
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Создает таблицу для отслеживания выполненных миграций
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Получает список всех SQL-файлов в папке migrations
    const migrationsDir = path.join(__dirname);
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      // Проверяет, была ли уже применена эта миграция
      const result = await client.query(
        'SELECT id FROM migrations WHERE name = $1',
        [file]
      );

      if (result.rows.length === 0) {
        console.log(`Applying migration: ${file}`);

        const sql = fs.readFileSync(
          path.join(migrationsDir, file),
          'utf8'
        );

        // Выполняет только UP часть (до комментария -- Down)
        const upSql = sql.split('-- Down')[0];

        try {
          await client.query('BEGIN');
          await client.query(upSql);
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [file]
          );
          await client.query('COMMIT');
          console.log(`Migration ${file} applied successfully`);
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`Error applying ${file}:`, err.message);
          throw err;
        }
      } else {
        console.log(`Migration ${file} already applied, skipping...`);
      }
    }

    console.log('Миграция успешна!');

  } catch (error) {
    console.error('Миграция провалена:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();