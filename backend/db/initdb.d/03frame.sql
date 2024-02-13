CREATE TABLE IF NOT EXISTS frame
(
    frame_id    int auto_increment primary key,
    frame_title varchar(50) unique not null
) ENGINE innoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

INSERT INTO S10P12A606.frame (frame_id, frame_title)
VALUES (1, '프레임 없음'),
       (2, '싸피 1기,6기,11기'),
       (3, '싸피 2기,7기'),
       (4, '싸피 3기,8기'),
       (5, '싸피 4기,9기'),
       (6, '싸피 5기,10기'),
       (7, '해피버스데이'),
       (8, '축하축하'),
       (9, '스티치'),
       (10, '엽서'),
       (11, '보라돌이'),
       (12, '아쿠아리움'),
       (13, 'v-log 흰색'),
       (14, 'v-log 검은색'),
       (15, '웹사이트 핑크'),
       (16, '웹사이트 블루'),
       (17, '웹사이트 퍼플'),
       (18, '구름 핑크'),
       (19, '구름 블루'),
       (20, '구름 퍼플'),
       (21, '따옴표'),
       (22, '집중');
