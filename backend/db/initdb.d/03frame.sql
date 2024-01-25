CREATE TABLE IF NOT EXISTS frame (
    frame_id int auto_increment primary key,
    frame_title varchar(50) unique not null,
    frame_image_url varchar(8200),
    frame_body text,
    font_id int default 1,
    font_size int default 20,
    font_bold bool default false,
    FOREIGN KEY(font_id) REFERENCES font(font_id)
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

insert into S10P12A606.frame(frame_title) value ("프레임 없음");