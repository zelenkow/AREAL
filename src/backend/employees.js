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

export default router;