<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// Guardián de sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["estado" => "error", "mensaje" => "Acceso no autorizado. Inicie sesión."]);
    exit;
}

http_response_code(200);
echo json_encode([
    "estado" => "exito",
    "data"   => [
        "id"     => $_SESSION['usuario_id'],
        "nombre" => $_SESSION['usuario_nombre'],
        "email"  => $_SESSION['usuario_email'] ?? null,
        "rol"    => $_SESSION['usuario_rol']
    ]
], JSON_UNESCAPED_UNICODE);