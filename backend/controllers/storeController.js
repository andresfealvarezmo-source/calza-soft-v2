const pool = require('../models/db');

exports.obtenerPuntosVenta = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM puntos_venta');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
