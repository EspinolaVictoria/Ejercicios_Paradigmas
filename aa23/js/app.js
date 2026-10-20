document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTOS DEL DOM ===
    const navPublico            = document.querySelector('#nav-publico');
    const tabLogin              = document.querySelector('#tab-login');
    const tabRegistro           = document.querySelector('#tab-registro');

    const vistaLogin            = document.querySelector('#vista-login');
    const vistaRegistro         = document.querySelector('#vista-registro');
    const vistaPanel            = document.querySelector('#vista-panel');

    const formLogin             = document.querySelector('#form-login');
    const formRegistro          = document.querySelector('#form-registro');

    const msgLogin              = document.querySelector('#msg-login');
    const msgRegistro           = document.querySelector('#msg-registro');

    const btnLogout             = document.querySelector('#btn-logout');
    const btnAbrirRegistroPanel = document.querySelector('#btn-abrir-registro-panel');

    // === INICIALIZACIÓN ===
    comprobarSesion();

    // === NAVEGACIÓN ENTRE PESTAÑAS ===
    tabLogin.addEventListener('click', () => mostrarVistaPublica('login'));
    tabRegistro.addEventListener('click', () => mostrarVistaPublica('registro'));

    btnAbrirRegistroPanel.addEventListener('click', () => {
        mostrarVistaPublica('registro');
        mostrarMensaje(msgRegistro, 'Registre un nuevo usuario para el sistema.', 'info');
    });

    // === 1. PROCESO DE LOGIN ===
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        mostrarMensaje(msgLogin, 'Autenticando con el servidor...', 'info');

        const payload = {
            email: document.querySelector('#login-email').value.trim(),
            password: document.querySelector('#login-pass').value
        };

        try {
            const res = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const resultado = await res.json();

            if (res.ok && resultado['estado'] === 'exito') {
                ocultarMensaje(msgLogin);
                formLogin.reset();
                mostrarPanelPrivado(resultado['usuario']);
            } else {
                mostrarMensaje(msgLogin, resultado['mensaje'] || 'Credenciales inválidas.', 'error');
            }
        } catch (error) {
            mostrarMensaje(msgLogin, 'Error de conexión con la API de autenticación.', 'error');
        }
    });

    // === 2. PROCESO DE REGISTRO ===
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();
        mostrarMensaje(msgRegistro, 'Guardando usuario en MySQL...', 'info');

        const payload = {
            nombre: document.querySelector('#reg-nombre').value.trim(),
            email: document.querySelector('#reg-email').value.trim(),
            password: document.querySelector('#reg-pass').value
        };

        try {
            const res = await fetch('api/registro.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const resultado = await res.json();

            if (res.ok && resultado['estado'] === 'exito') {
                mostrarMensaje(msgRegistro, '¡Usuario registrado correctamente! Ya podés iniciar sesión.', 'exito');
                formRegistro.reset();
            } else {
                mostrarMensaje(msgRegistro, resultado['mensaje'] || 'Error al registrar el usuario.', 'error');
            }
        } catch (error) {
            mostrarMensaje(msgRegistro, 'Error al conectar con la API de registro.', 'error');
        }
    });

    // === 3. VERIFICAR SESIÓN ACTIVA ===
    async function comprobarSesion() {
        try {
            const res = await fetch('api/perfil.php');
            const resultado = await res.json();

            if (res.ok && resultado['estado'] === 'exito') {
                mostrarPanelPrivado(resultado['data']);
            } else {
                mostrarVistaPublica('login');
            }
        } catch (error) {
            mostrarVistaPublica('login');
        }
    }

    // === 4. PROCESO DE LOGOUT ===
    btnLogout.addEventListener('click', async () => {
        try {
            const res = await fetch('api/logout.php', { method: 'POST' });
            if (res.ok) {
                mostrarVistaPublica('login');
                formLogin.reset();
                mostrarMensaje(msgLogin, 'Sesión cerrada correctamente.', 'info');
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    });

    // === FUNCIONES AUXILIARES DE CONTROL DE VISTAS (SPA) ===
    function mostrarVistaPublica(pestana) {
        navPublico.classList.remove('oculto');
        vistaPanel.classList.add('oculto');

        if (pestana === 'login') {
            tabLogin.classList.add('active');
            tabRegistro.classList.remove('active');
            vistaLogin.classList.remove('oculto');
            vistaRegistro.classList.add('oculto');
        } else {
            tabRegistro.classList.add('active');
            tabLogin.classList.remove('active');
            vistaRegistro.classList.remove('oculto');
            vistaLogin.classList.add('oculto');
        }
    }

    function mostrarPanelPrivado(usuario) {
        navPublico.classList.add('oculto');
        vistaLogin.classList.add('oculto');
        vistaRegistro.classList.add('oculto');
        vistaPanel.classList.remove('oculto');

        // Renderizado seguro vía textContent (anti-XSS)
        document.querySelector('#user-nombre').textContent = usuario['nombre'] || 'Usuario';
        document.querySelector('#user-email').textContent  = usuario['email']  || 'Sin email registrado';
        document.querySelector('#user-rol').textContent    = usuario['rol']    || 'cliente';
    }

    function mostrarMensaje(elemento, texto, tipo) {
        elemento.textContent = texto;
        elemento.className = `mensaje-box ${tipo}`;
    }

    function ocultarMensaje(elemento) {
        elemento.textContent = '';
        elemento.className = 'mensaje-box';
    }
});