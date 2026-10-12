const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'barbershop_db', // 
  password: '12345678', //
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к PostgreSQL:', err.message);
  } else {
    console.log('Успешно подключено к базе barbershop_db!');
  }
});

module.exports = pool;