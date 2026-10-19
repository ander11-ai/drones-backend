require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Habilita la comunicación con React[cite: 10, 30, 34]

// Si estás en local usa createConnection, si vas a la nube (Aiven) usa createPool con SSL (Guía 14)[cite: 10, 34]
const conexion = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tienda_drones',
    port: process.env.DB_PORT || 3306
});

conexion.connect(err => {
    if (err) {
        console.error('Error de conexión a MySQL: ', err);
        return;
    }
    console.log('Conectado exitosamente a la base de datos de Drones');
});

// --- RUTAS DE CLIENTES ---
app.get('/clientes', (req, res) => {
    conexion.query('SELECT * FROM clientes', (err, r) => err ? res.status(500).send(err) : res.json(r));
});

// --- RUTAS DE DRONES (PRODUCTOS) ---
app.get('/drones', (req, res) => {
    conexion.query('SELECT * FROM drones', (err, r) => err ? res.status(500).send(err) : res.json(r));
});

app.post('/drones', (req, res) => {
    const { nombre, modelo, precio } = req.body;
    const sql = 'INSERT INTO drones (nombre, modelo, precio) VALUES (?, ?, ?)';
    conexion.query(sql, [nombre, modelo, precio], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Dron registrado correctamente' });
    });
});

// --- RUTAS DE VENTAS (CRUD + JOIN) ---
app.get('/ventas', (req, res) => {
    const sql = `
        SELECT v.id, c.nombre AS cliente, d.nombre AS dron, 
        v.cantidad, v.fecha, d.precio, (v.cantidad * d.precio) AS total,
        v.cliente_id, v.dron_id
        FROM ventas v
        INNER JOIN clientes c ON v.cliente_id = c.id
        INNER JOIN drones d ON v.dron_id = d.id
    `;
    conexion.query(sql, (err, resultados) => {
        if (err) return res.status(500).send(err);
        res.json(resultados);
    });
});

app.post('/ventas', (req, res) => {
    const { cliente_id, dron_id, cantidad, fecha } = req.body;
    const sql = 'INSERT INTO ventas (cliente_id, dron_id, cantidad, fecha) VALUES (?, ?, ?, ?)';
    conexion.query(sql, [cliente_id, dron_id, cantidad, fecha], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Venta de dron registrada correctamente' });
    });
});

app.put('/ventas/:id', (req, res) => {
    const id = req.params.id;
    const { cliente_id, dron_id, cantidad, fecha } = req.body;
    const sql = 'UPDATE ventas SET cliente_id=?, dron_id=?, cantidad=?, fecha=? WHERE id=?';
    conexion.query(sql, [cliente_id, dron_id, cantidad, fecha, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: `Venta ID ${id} actualizada con éxito` });
    });
});

app.delete('/ventas/:id', (req, res) => {
    const id = req.params.id;
    conexion.query('DELETE FROM ventas WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: `Venta ID ${id} eliminada correctamente` });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor de la tienda de drones corriendo en puerto ${PORT}`);
});