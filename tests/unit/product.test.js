const request = require('supertest');
const app = require('../../backend/server');

describe('Pruebas Unitarias / Integración - Calza Soft API', () => {
    
    it('CP-001: Debería registrar un producto con datos válidos', async () => {
        const res = await request(app)
            .post('/api/productos')
            .send({
                referencia: 'REF-TEST-99',
                nombre: 'Zapato Test Unitario',
                talla: '40',
                precioMenor: 100000,
                precioMayor: 80000,
                cantidadInicial: 10
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('idProducto');
    });

    it('CP-002: Debería rechazar registro con campos obligatorios vacíos', async () => {
        const res = await request(app)
            .post('/api/productos')
            .send({
                referencia: '',
                nombre: '',
                talla: ''
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('CP-003 / RF02: Debería consultar precios y productos exitosamente', async () => {
        const res = await request(app).get('/api/productos');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
