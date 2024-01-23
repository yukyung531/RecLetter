CREATE TABLE IF NOT EXISTS font (
    font_id int primary key auto_increment,
    font_title varchar(50) unique not null,
    font_family varchar(50) not null,
    font_url varchar(8200) not null
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

insert into S10P12A606.font(font_id, font_title, font_family, font_url) value
    (0,"오뮤다예쁨체(기본)", "omyu_pretty", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-01@1.0/omyu_pretty.woff2");

insert into S10P12A606.font(font_title, font_family, font_url) value
    ("프리텐다드", "Pretendard-Regular", "https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff");

