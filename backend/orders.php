<?php
include_once 'config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['user_id'])) {
            getOrders($conn, $_GET['user_id']);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "กรุณาระบุ user_id"], JSON_UNESCAPED_UNICODE);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        createOrder($conn, $data);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getOrders($conn, $user_id)
{
    $query = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $user_id);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get items for each order
    foreach ($orders as &$order) {
        $itemQuery = "SELECT oi.*, p.name as product_name, p.image_url, p.category 
                      FROM order_items oi 
                      LEFT JOIN products p ON oi.product_id = p.id 
                      WHERE oi.order_id = ?";
        $itemStmt = $conn->prepare($itemQuery);
        $itemStmt->bindParam(1, $order['id']);
        $itemStmt->execute();
        $order['items'] = $itemStmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($orders, JSON_UNESCAPED_UNICODE);
}

function createOrder($conn, $data)
{
    if (!isset($data->user_id) || !isset($data->items) || count($data->items) == 0) {
        http_response_code(400);
        echo json_encode(["message" => "กรุณากรอกข้อมูลให้ครบถ้วน"], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        $conn->beginTransaction();

        $total_price = 0;
        foreach ($data->items as $item) {
            $total_price += $item->price * $item->quantity;
        }

        $payment_method = isset($data->payment_method) ? $data->payment_method : 'transfer';

        $query = "INSERT INTO orders (user_id, total_price, payment_method) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(1, $data->user_id);
        $stmt->bindParam(2, $total_price);
        $stmt->bindParam(3, $payment_method);
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
        echo json_encode([
            "message" => "สั่งซื้อสำเร็จ!",
            "order_id" => $order_id
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(503);
        echo json_encode([
            "message" => "ไม่สามารถสั่งซื้อได้ กรุณาลองใหม่",
            "error" => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}
?>