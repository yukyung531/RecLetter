CREATE TABLE IF NOT EXISTS script (
    script_id int primary key auto_increment,
    script_title varchar(100),
    script_content varchar(1500)
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;