CREATE TABLE IF NOT EXISTS frame
(
    frame_id    int auto_increment primary key,
    frame_title varchar(50) unique not null
) ENGINE innoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

INSERT INTO S10P12A606.frame (frame_id, frame_title)
VALUES (1, '프레임 없음'),
       (2, '싸피 10기'),
       (3, '싸피 11기'),
       (4, '하트'),
       (5, '하트2'),
       (6, '개발자'),
       (7, '개발자2'),
       (8, '학용품'),
       (9, '별'),
       (10, '웹사이트 빨강'),
       (11, '웹사이트 파랑'),
       (12, '웹사이트 보라'),
       (13, 'v-log 흰색'),
       (14, 'v-log 흰색2'),
       (15, 'v-log 검은색'),
       (16, 'v-log 검은색2');
