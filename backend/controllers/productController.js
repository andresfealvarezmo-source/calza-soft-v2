const pool = require('../models/db');

exports.crearProducto = async (req, res) => {
    try {
        console.log("BODY RECIBIDO:", req.body);
        console.log("ARCHIVO RECIBIDO:", req.file);

        const { referencia, nombre, talla, precioMenor, precioMayor, estado, idReferencia, cantidadInicial } = req.body;
        
        if (!referencia || !nombre || !talla || !precioMenor || !precioMayor) {
            return res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }

        let imagenUrl = '/static/img/no-image.svg';
        if (req.file) {
            imagenUrl = `/uploads/${req.file.filename}`;
        }

        const [result] = await pool.query(
            'INSERT INTO productos (referencia, nombre, imagen, talla, precioMenor, precioMayor, estado, idReferencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [referencia, nombre, imagenUrl, talla, precioMenor, precioMayor, estado || 'Disponible', idReferencia || null]
        );

        const idProducto = result.insertId;
        await pool.query('INSERT INTO inventario (idProducto, cantidad) VALUES (?, ?)', [idProducto, cantidadInicial || 0]);

        res.status(201).json({ message: 'Producto registrado exitosamente.', idProducto });
    } catch (error) {
        console.error("--- ERROR CRITICO EN BACKEND ---");
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerProductos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.idProducto, p.referencia, p.nombre, p.imagen, p.talla, p.precioMenor, p.precioMayor, p.estado, 
            COALESCE(i.cantidad, 0) AS cantidad
            FROM productos p
            LEFT JOIN inventario i ON p.idProducto = i.idProducto
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { referencia, nombre, talla, precioMenor, precioMayor, estado } = req.body;

        let query = 'UPDATE productos SET referencia = ?, nombre = ?, talla = ?, precioMenor = ?, precioMayor = ?, estado = ?';
        let params = [referencia, nombre, talla, precioMenor, precioMayor, estado];

        if (req.file) {
            query += ', imagen = ?';
            params.push(`/uploads/${req.file.filename}`);
        }

        query += ' WHERE idProducto = ?';
        params.push(id);

        await pool.query(query, params);
        res.json({ message: 'Producto actualizado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM productos WHERE idProducto = ?', [id]);
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ error: 'Este producto tiene ventas asociadas y no puede eliminarse sin afectar el historial.' });
        res.status(500).json({ error: 'No fue posible eliminar el producto.' });
    }
};