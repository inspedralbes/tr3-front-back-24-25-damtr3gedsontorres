CREATE DATABASE game_db;
USE game_db;

-- Tabla de Usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    coins INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Inventario del usuario
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES shop(id)
);

-- Tabla de Monedas (Historial)
CREATE TABLE currency (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount INT,
    type ENUM('earned', 'spent'),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de Tienda
CREATE TABLE shop (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Compras
CREATE TABLE purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_id INT,
    amount INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES shop(id)
);

-- Tabla de Administradores
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Armas
CREATE TABLE weapons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    damage INT NOT NULL,
    attack_speed FLOAT NOT NULL,
    rarity ENUM('common', 'rare', 'epic', 'legendary') NOT NULL,
    price INT NOT NULL
);

-- Tabla de Enemigos
CREATE TABLE enemies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    health INT NOT NULL,
    attack INT NOT NULL,
    speed FLOAT NOT NULL,
    reward INT NOT NULL
);

-- Tabla de Oleadas
CREATE TABLE waves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wave_number INT NOT NULL,
    enemy_id INT NOT NULL,
    enemy_count INT NOT NULL,
    difficulty_level ENUM('easy', 'medium', 'hard', 'insane') NOT NULL,
    FOREIGN KEY (enemy_id) REFERENCES enemies(id)
);
