# Sistema de Autenticación Segura - REST API + SPA

## Requisitos
- PHP 7.4+ con extensiones PDO y pdo_mysql
- MySQL 5.7+ / MariaDB 10.3+
- Servidor web Apache/Nginx (o XAMPP/Laragon)

## Instalación
1. Importar `database/backend.sql` en phpMyAdmin o por consola:
   mysql -u root -p < database/backend.sql
2. Verificar credenciales en `config/conexion.php`.
3. Servir la carpeta del proyecto desde el webroot.
4. Abrir `index.html` en el navegador.

## Funcionalidad
- Registro con hash BCRYPT (password_hash)
- Login con verificación (password_verify) + session_regenerate_id(true)
- Endpoint privado protegido: api/perfil.php (401 si no hay sesión)
- Logout con destrucción de cookie y sesión
- Frontend SPA con renderizado seguro vía .textContent (anti-XSS)

## Seguridad aplicada
- Prepared Statements PDO (anti SQL Injection)
- Hash BCRYPT (anti filtrado de contraseñas)
- Cookies HttpOnly + SameSite=Lax
- Escapado en salida vía textContent (anti XSS)
- Regeneración de ID de sesión post-login (anti session fixation)
- Método HTTP validado en todos los endpoints (anti CSRF accidental)