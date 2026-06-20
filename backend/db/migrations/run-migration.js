// скрипт для запуска миграций

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

    // Читает файл миграции с этой же папки
    //!!внимательно путь указать. В данном случае sql файл в папке db/migrations,
    const sql = fs.readFileSync(
      path.join(__dirname, '20260620_add_inactive_status.sql'),
      'utf8'
    );

    // Выполняет только UP часть (до комментария -- Down)
    const upSql = sql.split('-- Down')[0];
    
    await client.query(upSql);
    console.log('Миграция выполнена успешно!');

  } catch (error) {
    console.error('Ошибка миграции:', error.message);
  } finally {
    await client.end();
  }
}

runMigration();