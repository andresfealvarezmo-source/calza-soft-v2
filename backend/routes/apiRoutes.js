const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const inventoryController = require('../controllers/inventoryController');
const referenceController = require('../controllers/referenceController');
const storeController = require('../controllers/storeController');
const saleController = require('../controllers/saleController');

router.post('/auth/registro', authController.registrarCliente);
router.post('/auth/login', authController.login);

router.get('/productos', productController.obtenerProductos);
router.post('/productos', upload.single('imagen'), productController.crearProducto);
router.put('/productos/:id', upload.single('imagen'), productController.actualizarProducto);
router.delete('/productos/:id', productController.eliminarProducto);

router.get('/inventario', inventoryController.consultarStock);
router.put('/inventario/:idProducto', inventoryController.actualizarStock);

router.get('/referencias', referenceController.obtenerReferencias);
router.post('/referencias', referenceController.crearReferencia);

router.get('/puntos-venta', storeController.obtenerPuntosVenta);

router.post('/ventas', saleController.registrarVenta);
router.get('/ventas', saleController.obtenerVentas);

module.exports = router;