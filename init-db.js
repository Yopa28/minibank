const mysql = require('mysql2/promise');
require('dotenv').config();

async function init() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    });

    console.log('Koneksi ke Aiven berhasil! Sedang membuat tabel...');

    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'user',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
        `CREATE TABLE IF NOT EXISTS accounts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      balance DECIMAL(15, 2) DEFAULT 0.00,
      isFrozen BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
        `CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      accountId INT,
      type ENUM('deposit', 'withdraw', 'transfer_in', 'transfer_out'),
      amount DECIMAL(15, 2),
      referenceId INT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (accountId) REFERENCES accounts(id)
    )`,
        `CREATE TABLE IF NOT EXISTS audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      action VARCHAR(255),
      entity VARCHAR(255),
      entityId INT,
      performedBy VARCHAR(255),
      description TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    ];

    for (let query of queries) {
        await connection.query(query);
    }

    console.log('✅ Semua tabel berhasil dibuat di Aiven!');

    // Opsional: Buat akun Admin pertama (password: admin123)
    // Kamu bisa ganti passwordnya nanti
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('admin123', 10);
    try {
        await connection.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', hash, 'admin']);
        console.log('✅ Akun Admin berhasil dibuat! User: admin, Pass: admin123');
    } catch (e) {
        console.log('ℹ️ Akun admin sudah ada atau gagal dibuat.');
    }

    await connection.end();
}

init().catch(err => console.error('Gagal:', err));
