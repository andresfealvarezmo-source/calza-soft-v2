const pool = require('../models/db');

exports.consultarStock = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.idProducto, p.referencia, p.nombre, p.talla, i.cantidad, 
            CASE WHEN i.cantidad = 0 THEN 'Agotado' ELSE 'Disponible' END AS estadoStock
            FROM productos p
            JOIN inventario i ON p.idProducto = i.idProducto
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarStock = async (req, res) => {
    try {
        const { idProducto } = req.params;
        const { cantidad } = req.body;

        if (cantidad < 0) {
            return res.status(400).json({ error: 'La cantidad no puede ser negativa.' });
        }

        const estado = cantidad === 0 ? 'Agotado' : 'Disponible';

        await pool.query('UPDATE inventario SET cantidad = ? WHERE idProducto = ?', [cantidad, idProducto]);
        await pool.query('UPDATE productos SET estado = ? WHERE idProducto = ?', [estado, idProducto]);

        res.json({ message: 'Stock actualizado correctamente (CP-005).' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
