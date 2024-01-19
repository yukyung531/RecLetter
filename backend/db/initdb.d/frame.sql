CREATE TABLE IF NOT EXISTS frame (
    frame_id int auto_increment primary key,
    frame_title varchar(50) unique not null,
    frame_image_url varchar(8200),
    frame_body text,
    font_id int default 0,
    font_size int default 20,
    font_bold bool default false,
    FOREIGN KEY(font_id) REFERENCES font(font_id)
)