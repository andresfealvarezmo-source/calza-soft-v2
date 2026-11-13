const pool = require('../models/db');

exports.registrarVenta = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { idUsuario, items, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío.' });
        }

        const [ventaResult] = await connection.query(
            'INSERT INTO ventas (total, idUsuario) VALUES (?, ?)',
            [total, idUsuario || 1]
        );
        const idVenta = ventaResult.insertId;

        for (let item of items) {
            const [invRows] = await connection.query('SELECT cantidad FROM inventario WHERE idProducto = ?', [item.idProducto]);
            if (invRows.length === 0 || invRows[0].cantidad < item.cantidad) {
                await connection.rollback();
                return res.status(400).json({ error: `Stock insuficiente para el producto ID ${item.idProducto}` });
            }

            const subtotal = item.cantidad * item.precioUnitario;

            await connection.query(
                'INSERT INTO detalle_venta (idVenta, idProducto, cantidad, precioUnitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                [idVenta, item.idProducto, item.cantidad, item.precioUnitario, subtotal]
            );

            const nuevaCantidad = invRows[0].cantidad - item.cantidad;
            const nuevoEstado = nuevaCantidad === 0 ? 'Agotado' : 'Disponible';

            await connection.query('UPDATE inventario SET cantidad = ? WHERE idProducto = ?', [nuevaCantidad, item.idProducto]);
            await connection.query('UPDATE productos SET estado = ? WHERE idProducto = ?', [nuevoEstado, item.idProducto]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Compra realizada con éxito y stock actualizado.', idVenta });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

exports.obtenerVentas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT v.idVenta, v.fecha, v.total, u.nombre AS cliente
            FROM ventas v
            JOIN usuarios u ON v.idUsuario = u.idUsuario
            ORDER BY v.fecha DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
