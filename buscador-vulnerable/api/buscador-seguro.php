<?php

require_once '../config/conexion.php';

header('Content-Type: application/json; charset=utf-8');

$q = $_GET['q'] ?? '';

try {

    $sql = "SELECT id, nombre, categoria, precio, stock
            FROM productos
            WHERE nombre LIKE :busqueda";

    $stmt = $pdo->prepare($sql);

    $busqueda = '%' . $q . '%';

    $stmt->execute([
        ':busqueda' => $busqueda
    ]);

    $productos = $stmt->fetchAll();

    http_response_code(200);

    echo json_encode([
        "estado" => "exito",
        "total" => count($productos),
        "data" => $productos
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "estado" => "error",
        "mensaje" => "Error al realizar la búsqueda."
    ], JSON_UNESCAPED_UNICODE);
}