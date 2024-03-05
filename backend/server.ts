import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: 'dittPassord',
    port: 5432,
});

app.use(cors());
app.use(express.json());

app.get('/api/todo', async (req: Request, res: Response) => {
    const { rows } = await pool.query('SELECT * FROM todo ORDER BY id ASC');
    res.send(rows);
});

app.post('/api/todo', async (req: Request, res:Response) => {
    const { title, status } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO todo (title, status) VALUES ($1, $2) RETURNING *', 
            [title, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).send('Server error');
    }
});

app.put('/api/todo/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE todo SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Todo not found');
        }
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).send('Server error');
    }
})

app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});