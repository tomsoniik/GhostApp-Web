<?php
class Database {
    private $host;
    private $port;
    private $db_name;
    private $username;
    private $password;

    public function __construct() {
        $this->host = getenv('MYSQLHOST') ?: "localhost";
        $this->port = getenv('MYSQLPORT') ?: "3306";
        $this->db_name = getenv('MYSQLDATABASE') ?: "armessage_db";
        $this->username = getenv('MYSQLUSER') ?: "root";
        $this->password = getenv('MYSQLPASSWORD') ?: "";
    }
    public $conn;

    public function getConnection() {
        $this->conn = null;

        // Pobieramy dane z otoczenia (Railway)
        $this->host = getenv('MYSQLHOST') ?: "localhost";
        $this->port = getenv('MYSQLPORT') ?: "3306";
        $this->db_name = getenv('MYSQLDATABASE') ?: "armessage_db";
        $this->username = getenv('MYSQLUSER') ?: "root";
        $this->password = getenv('MYSQLPASSWORD') ?: "";

        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("GHOST_DB_ERROR: " . $exception->getMessage());
            header('Content-Type: application/json');
            echo json_encode(["error" => "Błąd połączenia z bazą danych. Spróbuj ponownie później."]);
            exit;
        }

        return $this->conn;
    }
}
?>
