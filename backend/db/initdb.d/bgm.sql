CREATE TABLE IF NOT EXISTS bgm
(
    bgm_id  int primary key auto_increment,
    bgm_title varchar(100) not null,
    bgm_url varchar(8200)
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

insert into S10P12A606.bgm(bgm_id, bgm_title) value
    (0,"bgm 없음");