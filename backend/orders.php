<?php
include_once 'config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    createOrder($conn, $data);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}

function createOrder($conn, $data)
{
    if (!isset($data->user_id) || !isset($data->items) || count($data->items) == 0) {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
        return;
    }

    try {
        $conn->beginTransaction();

        $total_price = 0;
        foreach ($data->items as $item) {
            $total_price += $item->price * $item->quantity;
        }

        $query = "INSERT INTO orders (user_id, total_price) VALUES (?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(1, $data->user_id);
        $stmt->bindParam(2, $total_price);
        $stmt->execute();
        $order_id = $conn->lastInsertId();

        $query_item = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
        $stmt_item = $conn->prepare($query_item);

        foreach ($data->items as $item) {
            $stmt_item->bindParam(1, $order_id);
            $stmt_item->bindParam(2, $item->product_id);
            $stmt_item->bindParam(3, $item->quantity);
            $stmt_item->bindParam(4, $item->price);
            $stmt_item->execute();
        }

        $conn->commit();
        http_response_code(201);
        echo json_encode(["message" => "Order created.", "order_id" => $order_id]);

    } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(503);
        echo json_encode(["message" => "Unable to create order.", "error" => $e->getMessage()]);
    }
}
?>