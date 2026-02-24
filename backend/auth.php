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
        echo json_encode(["message" => "Incomplete data."]);
        return;
    }

    $query = "INSERT INTO users (username, password) VALUES (?, ?)";
    $stmt = $conn->prepare($query);

    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $stmt->bindParam(1, $data->username);
    $stmt->bindParam(2, $password_hash);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "User was registered."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to register user."]);
    }
}

function login($conn, $data)
{
    if (!isset($data->username) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
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
                "message" => "Successful login.",
                "user" => [
                    "id" => $row['id'],
                    "username" => $row['username'],
                    "role" => $row['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Login failed."]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Login failed."]);
    }
}
?>