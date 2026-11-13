const pool = require('../models/db');

exports.crearReferencia = async (req, res) => {
    try {
        const { nombreRef, descripcion, fechaIngreso } = req.body;

        if (!nombreRef || !descripcion || !fechaIngreso) {
            return res.status(400).json({ error: 'Faltan datos obligatorios para la referencia.' });
        }

        const [existing] = await pool.query('SELECT * FROM referencias WHERE nombreRef = ?', [nombreRef]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'La referencia ya existe en el sistema. Se evita el duplicado (CP-008).' });
        }

        await pool.query(
            'INSERT INTO referencias (nombreRef, descripcion, fechaIngreso) VALUES (?, ?, ?)',
            [nombreRef, descripcion, fechaIngreso]
        );

        res.status(201).json({ message: 'Nueva referencia registrada en el catálogo exitosamente (CP-007).' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerReferencias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM referencias');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
