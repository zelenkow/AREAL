import express from 'express';
import db from './database.js';

const router = express.Router();

router.post('/', function(req, res) {
    const { full_name, birth_date, pass_data, phone_number, address, department, position, salary, hire_date } = req.body;
    
    const sql = `INSERT INTO employees 
        (full_name, birth_date, pass_data, phone_number, address, department, position, salary, hire_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [full_name, birth_date, pass_data, phone_number, address, department, position, salary, hire_date]);
    res.json({ status: "Сотрудник создан"});
});

router.get('/', function(req, res) {
    const { department, position } = req.query;
    
    let sql = 'SELECT * FROM employees';
    let params = [];
    
    if (department || position) {
        sql += ' WHERE';
        
        if (department) {
            sql += ' department = ?';
            params.push(department);
        }
        
        if (position) {
            if (department) sql += ' AND';
            sql += ' position = ?';
            params.push(position);
        }
    }

    db.all(sql, params, function(_, rows) {
        res.json(rows);
    });
});

router.get('/search', function(req, res) {
    const searchName = req.query.name;
    const sql = 'SELECT * FROM employees WHERE full_name LIKE ?';
    const params = [`%${searchName}%`];
    
    db.all(sql, params, function(_, rows) {
        res.json(rows);
    });
});

router.get('/:id', function(req, res) {
    const sql = 'SELECT * FROM employees WHERE id = ?';
    const params = [req.params.id];
    
    db.get(sql, params, function(_, row) {
        res.json(row); 
    });
});

router.patch('/:id', function(req, res) {
    const { full_name, birth_date, pass_data, phone_number, address, department, position, salary, hire_date } = req.body;
    
    const sql = `UPDATE employees SET 
        full_name = COALESCE(?, full_name),
        birth_date = COALESCE(?, birth_date), 
        pass_data = COALESCE(?, pass_data),
        phone_number = COALESCE(?, phone_number),
        address = COALESCE(?, address),
        department = COALESCE(?, department),
        position = COALESCE(?, position),
        salary = COALESCE(?, salary),
        hire_date = COALESCE(?, hire_date)
        WHERE id = ?`;
    
    const params = [full_name, birth_date, pass_data, phone_number, address, department, position, salary, hire_date, req.params.id];
    
    db.run(sql, params, function() {
        res.json({ status: "Данные обновлены" });
    });
});

router.patch('/:id/fire', function(req, res) {
    const sql = 'UPDATE employees SET is_fired = 1 WHERE id = ?';
    const params = [req.params.id];
    
    db.run(sql, params, function() {
        res.json({ status: "Сотрудник уволен" });
    });
});

export default router;