require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Montar las rutas de la API bajo el prefijo /api
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// Redirigir URLs antiguas de dashboards mal resueltas bajo /api/auth/.
app.get('/api/auth/:page', (req, res, next) => {
  const allowed = new Set(['login.html', 'admin_dashboard.html', 'vendedor_dashboard.html', 'cliente_dashboard.html']);
  if (!allowed.has(req.params.page)) return next();
  return res.redirect(302, '/' + req.params.page);
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/static', express.static(path.join(__dirname, '../frontend/static')));
app.get(['/login.html', '/admin_dashboard.html', '/cliente_dashboard.html', '/vendedor_dashboard.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/templates', path.basename(req.path)));
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/status', (req, res) => {
  res.json({ mensaje: "API de Calza Soft funcionando correctamente en Render" });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta API no encontrada', ruta: req.originalUrl }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/templates/login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});