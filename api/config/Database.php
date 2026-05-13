<?php
class Database {
    private $host = "viaduct.proxy.rlwy.net";
    private $port = 18369;
    private $db_name = "railway";
    private $username = "root";
    private $password = "GPbWNoQKDNBXwPfYyjhBnPNsTlQlgpwh";
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
