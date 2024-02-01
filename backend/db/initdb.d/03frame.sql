CREATE TABLE IF NOT EXISTS frame (
                                     frame_id int auto_increment primary key,
                                     frame_title varchar(50) unique not null,
                                     font_id int default 1,
                                     font_size int default 20,
                                     font_bold bool default false,
                                     FOREIGN KEY(font_id) REFERENCES font(font_id)
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO S10P12A606.frame (frame_id, frame_title, font_id, font_size, font_bold) VALUES (1, '프레임 없음', 1, 20, 0);
INSERT INTO S10P12A606.frame (frame_id, frame_title, font_id, font_size, font_bold) VALUES (2, '싸피 10기', 1, 20, 0);
INSERT INTO S10P12A606.frame (frame_id, frame_title, font_id, font_size, font_bold) VALUES (3, '싸피 11기', 1, 20, 0);
INSERT INTO S10P12A606.frame (frame_id, frame_title, font_id, font_size, font_bold) VALUES (4, '하트', 1, 20, 0);
INSERT INTO S10P12A606.frame (frame_id, frame_title, font_id, font_size, font_bold) VALUES (5, '하트2', 1, 20, 0);
INSERT INTO S10P12A606.frame (frame_id, frame_title, font_id, font_size, font_bold) VALUES (6, '개발자', 1, 20, 0);
INSERT INTO S10P12A606.frame (frame_id, frame_title, font_id, font_size, font_bold) VALUES (7, '개발자2', 1, 20, 0);
INSERT INTO S10P12A606.frame (frame_id, frame_title, font_id, font_size, font_bold) VALUES (8, '학용품', 1, 20, 0);
INSERT INTO S10P12A606.frame (frame_id, frame_title, font_id, font_size, font_bold) VALUES (9, '별', 1, 20, 0);