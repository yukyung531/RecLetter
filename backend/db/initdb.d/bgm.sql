CREATE TABLE IF NOT EXISTS bgm
(
    bgm_id  int primary key auto_increment,
    bgm_url varchar(8200)
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;