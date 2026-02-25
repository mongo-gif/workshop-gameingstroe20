<?php
include_once 'config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getProduct($conn, $_GET['id']);
        } else {
            getProducts($conn);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getProducts($conn)
{
    $query = "SELECT * FROM products ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products, JSON_UNESCAPED_UNICODE);
}

function getProduct($conn, $id)
{
    $query = "SELECT * FROM products WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product) {
        echo json_encode($product, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Product not found."], JSON_UNESCAPED_UNICODE);
    }
}
?>