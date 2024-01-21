CREATE TABLE IF NOT EXISTS font (
    font_id int primary key auto_increment,
    font_title varchar(50) unique not null,
    font_family varchar(50) not null,
    font_url varchar(8200) not null
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;