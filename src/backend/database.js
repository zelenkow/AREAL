import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

const sql = `
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name VARCHAR(100) NOT NULL,
        birth_date VARCHAR(10) NOT NULL,
        passport_series_number VARCHAR(20) NOT NULL UNIQUE,
        phone_number VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        department VARCHAR(50) NOT NULL,
        position VARCHAR(50) NOT NULL,
        salary INTEGER NOT NULL,
        hire_date VARCHAR(10) NOT NULL,
        is_fired INTEGER DEFAULT 0
    )
`;

db.run(sql);

export default db;