import express from 'express';
import employ from './employees.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/employees', employ);

app.listen(PORT);