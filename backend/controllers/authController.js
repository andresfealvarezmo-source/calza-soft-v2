
const pool = require('../models/db');
const bcrypt = require('bcryptjs');

// Registro exclusivo para clientes
exports.registrarCliente = async (req, res) => {
    try {
        const { nombre, cedula, correo, contrasena, direccion } = req.body;

        if (!nombre || !cedula || !correo || !contrasena) {
            return res.status(400).json({
                error: 'Todos los campos obligatorios deben estar completos.'
            });
        }

        const correoNormalizado = correo.trim().toLowerCase();

        // Comprobar si el usuario ya existe
        const [existing] = await pool.query(
            'SELECT idUsuario FROM usuarios WHERE correo = ? OR cedula = ?',
            [correoNormalizado, cedula]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                error: 'El correo o la cédula ya están registrados.'
            });
        }

        // Proteger la contraseña
        const contrasenaHash = await bcrypt.hash(contrasena, 12);

        const [result] = await pool.query(
            `INSERT INTO usuarios
             (nombre, cedula, correo, contrasena, rol, direccion)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                cedula,
                correoNormalizado,
                contrasenaHash,
                'Cliente',
                direccion || 'Bogotá'
            ]
        );

        return res.status(201).json({
            message: 'Registro exitoso. ¡Ya puedes iniciar sesión!',
            idUsuario: result.insertId
        });

    } catch (error) {
        console.error('Error en registro:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'El correo o la cédula ya están registrados.'
            });
        }

        return res.status(500).json({
            error: 'No fue posible completar el registro.'
        });
    }
};

// Inicio de sesión para todos los roles
exports.login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({
                error: 'Debes ingresar correo y contraseña.'
            });
        }

        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correo.trim().toLowerCase()]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                error: 'Correo o contraseña incorrectos.'
            });
        }

        const usuario = rows[0];

        const contrasenaValida = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        if (!contrasenaValida) {
            return res.status(401).json({
                error: 'Correo o contraseña incorrectos.'
            });
        }

        return res.json({
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
        console.error('Error en login:', error);

        return res.status(500).json({
            error: 'Error interno al iniciar sesión.'
        });
    }
};
