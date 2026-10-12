const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // раздаёт сайт из папки public

// 1. ОПЕРАЦИЯ ЧТЕНИЯ (READ) - возвращаем последние записи из таблицы appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const query = `
      SELECT appointment_id, client_id, barber_id, service_id, 
             appointment_date, start_time, end_time, status
      FROM appointments
      ORDER BY appointment_id DESC
      LIMIT 10;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database read error' });
  }
});

// 2. ОПЕРАЦИЯ ЗАПИСИ (WRITE) - параметризованный INSERT (защита от SQL Injection)
app.post('/api/appointments', async (req, res) => {
  const { client_id, barber_id, service_id, appointment_date, start_time, end_time } = req.body;

  try {
    const insertQuery = `
      INSERT INTO appointments (client_id, barber_id, service_id, appointment_date, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')
      RETURNING *;
    `;
    const values = [
      client_id, 
      barber_id, 
      service_id, 
      appointment_date, 
      start_time, 
      end_time || '12:00:00'
    ];
    const result = await pool.query(insertQuery, values);

    res.status(201).json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database write error: ' + err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));