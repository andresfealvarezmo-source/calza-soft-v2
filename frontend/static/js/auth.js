document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      if (data.usuario.rol === 'Administrador') {
        window.location.href = 'admin_dashboard.html';
      } else if (data.usuario.rol === 'Vendedor') {
        window.location.href = 'vendedor_dashboard.html';
      } else {
        window.location.href = 'cliente_dashboard.html';
      }
    } else {
      document.getElementById('errorMsg').textContent = data.error || 'Credenciales incorrectas';
    }
  } catch (err) {
    document.getElementById('errorMsg').textContent = 'Error de conexión con el servidor.';
  }
});