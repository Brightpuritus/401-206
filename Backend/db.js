const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'crossover.proxy.rlwy.net',
  user: 'root',
  password: 'eMEYATyatxBispkfEDsbzzRvqwrDpAEh',
  database: 'railway',
  port: 15350,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;