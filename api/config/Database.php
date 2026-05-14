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

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4", $this->username, $this->password);
            // Wyjątki przy błędach
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Błąd połączenia z bazą danych: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
