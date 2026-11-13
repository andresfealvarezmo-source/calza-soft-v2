const pool = require('../models/db');

// Registro exclusivo para Clientes
exports.registrarCliente = async (req, res) => {
    try {
        const { nombre, cedula, correo, contrasena, direccion } = req.body;

        if (!nombre || !cedula || !correo || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben estar completos.' });
        }

        // Verificar si el correo o la cédula ya existen
        const [existing] = await pool.query('SELECT * FROM usuarios WHERE correo = ? OR cedula = ?', [correo, cedula]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'El correo electrónico o la cédula ya se encuentran registrados.' });
        }

        const rol = 'Cliente';
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, cedula, correo, contrasena, rol, direccion) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, cedula, correo, contrasena, rol, direccion || 'Bogotá']
        );

        res.status(201).json({ 
            message: 'Registro exitoso. ¡Ya puedes iniciar sesión!',
            idUsuario: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login general para Admin, Vendedor y Clientes registrados
exports.login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?', [correo, contrasena]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }

        const usuario = rows[0];
        res.json({
            message: 'Autenticación exitosa',
            usuario: {
                idUsuario: usuario.idUsuario,
                nombre: usuario.nombre,
                cedula: usuario.cedula,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};