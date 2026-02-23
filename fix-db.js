const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    });

    console.log('Koneksi ke Aiven berhasil! Sedang memperbaiki struktur tabel...');

    try {
        // 1. Tambahkan kolom ke audit_logs jika belum ada
        console.log('Memeriksa tabel audit_logs...');
        const [auditCols] = await connection.query("SHOW COLUMNS FROM audit_logs LIKE 'entity'");
        if (auditCols.length === 0) {
            await connection.query("ALTER TABLE audit_logs ADD COLUMN entity VARCHAR(255) AFTER action, ADD COLUMN entityId INT AFTER entity");
            console.log('✅ Kolom entity & entityId berhasil ditambahkan ke audit_logs.');
        } else {
            console.log('ℹ️ Tabel audit_logs sudah memiliki kolom entity.');
        }

        // 2. Update ENUM di tabel transactions
        console.log('Memperbarui ENUM di tabel transactions...');
        await connection.query("ALTER TABLE transactions MODIFY COLUMN type ENUM('deposit', 'withdraw', 'transfer_in', 'transfer_out', 'transfer')");
        console.log('✅ Tipe transaksi (ENUM) berhasil diperbarui!');

    } catch (err) {
        console.error('❌ Terjadi kesalahan:', err.message);
    } finally {
        await connection.end();
        console.log('Selesai!');
    }
}

fix().catch(err => console.error('Gagal total:', err));
