"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: 'dittPassord',
    port: 5432,
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/todo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield pool.query('SELECT * FROM todo ORDER BY id ASC');
    res.send(rows);
}));
app.post('/api/todo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, status } = req.body;
    try {
        const result = yield pool.query('INSERT INTO todo (title, status) VALUES ($1, $2) RETURNING *', [title, status]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).send('Server error');
    }
}));
app.put('/api/todo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = yield pool.query('UPDATE todo SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        }
        else {
            res.status(404).send('Todo not found');
        }
    }
    catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).send('Server error');
    }
}));
app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});
