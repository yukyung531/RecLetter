CREATE TABLE IF NOT EXISTS user (
    user_id varchar(16) primary key,
    user_email varchar(320) unique not null,
    user_nickname varchar(50) unique not null,
    user_password varchar(70) not null,
    created_at timestamp not null default current_timestamp(),
    deleted_at timestamp null default null
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;