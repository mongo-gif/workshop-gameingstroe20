<?php
include_once 'config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $action = isset($_GET['action']) ? $_GET['action'] : '';

    if ($action == 'register') {
        register($conn, $data);
    } elseif ($action == 'login') {
        login($conn, $data);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid action."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}

function register($conn, $data)
{
    if (!isset($data->username) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["message" => "กรุณากรอกข้อมูลให้ครบถ้วน"], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Validate username length
    if (strlen($data->username) < 3) {
        http_response_code(400);
        echo json_encode(["message" => "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Validate password length
    if (strlen($data->password) < 6) {
        http_response_code(400);
        echo json_encode(["message" => "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Check if username already exists
    $checkQuery = "SELECT id FROM users WHERE username = ?";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bindParam(1, $data->username);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(["message" => "ชื่อผู้ใช้นี้มีคนใช้แล้ว กรุณาเลือกชื่ออื่น"], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Check if email exists (if provided)
    $email = isset($data->email) ? $data->email : null;
    if ($email) {
        $checkEmail = "SELECT id FROM users WHERE email = ?";
        $checkEmailStmt = $conn->prepare($checkEmail);
        $checkEmailStmt->bindParam(1, $email);
        $checkEmailStmt->execute();

        if ($checkEmailStmt->rowCount() > 0) {
            http_response_code(409);
            echo json_encode(["message" => "อีเมลนี้มีคนใช้แล้ว กรุณาใช้อีเมลอื่น"], JSON_UNESCAPED_UNICODE);
            return;
        }
    }

    $query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($query);

    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $stmt->bindParam(1, $data->username);
    $stmt->bindParam(2, $password_hash);
    $stmt->bindParam(3, $email);

    try {
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "สมัครสมาชิกสำเร็จ!"], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่"], JSON_UNESCAPED_UNICODE);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง"], JSON_UNESCAPED_UNICODE);
    }
}

function login($conn, $data)
{
    if (!isset($data->username) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "กรุณากรอกข้อมูลให้ครบถ้วน"], JSON_UNESCAPED_UNICODE);
        return;
    }

    $query = "SELECT id, username, password, role FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $data->username);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (password_verify($data->password, $row['password'])) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "เข้าสู่ระบบสำเร็จ",
                "user" => [
                    "id" => $row['id'],
                    "username" => $row['username'],
                    "role" => $row['role']
                ]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"], JSON_UNESCAPED_UNICODE);
    }
}
?>