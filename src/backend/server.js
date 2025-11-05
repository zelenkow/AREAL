import express from 'express';
import employ from './employees.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/employees', employ);

app.listen(PORT);