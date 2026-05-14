<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $username;
    public $email;
    public $password;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Sprawdzenie czy email już istnieje
    public function emailExists() {
        $query = "SELECT id, password FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);

        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->password = $row['password'];
            return true;
        }
        return false;
    }

    // Sprawdzenie czy username już istnieje
    public function usernameExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE username = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);

        $this->username = htmlspecialchars(strip_tags($this->username));
        $stmt->bindParam(1, $this->username);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    // Walidacja siły hasła: min 1 mała, 1 duża, 1 cyfra, 1 znak specjalny
    public static function validatePasswordStrength($password) {
        if (!preg_match('/[a-z]/', $password)) return false;
        if (!preg_match('/[A-Z]/', $password)) return false;
        if (!preg_match('/[0-9]/', $password)) return false;
        if (!preg_match('/[^a-zA-Z0-9]/', $password)) return false;
        if (strlen($password) < 8) return false;
        return true;
    }

    // Tworzenie nowego użytkownika
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET username = :username, email = :email, password = :password";
        $stmt = $this->conn->prepare($query);

        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = htmlspecialchars(strip_tags($this->password));

        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':email', $this->email);
        
        // Hashowanie hasła za pomocą bcrypt
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);
        $stmt->bindParam(':password', $password_hash);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
