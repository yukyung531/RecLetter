CREATE TABLE IF NOT EXISTS script (
    script_id int primary key auto_increment,
    script_title varchar(100),
    script_content varchar(1500)
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO S10P12A606.script (script_id, script_title, script_content) VALUES (1, '교수님 생신 축하', 'OO교수님 안녕하세요! 싸피 OO기 OOO입니다. 생신 정말 축하드립니다!
교수님 덕분에 싸피 기간에 많이 배우고 성장할 수 있었습니다.
사랑으로 저희를 가르쳐 주셔서 정말 감사드립니다.
늘 건강하시고 좋은 일들만 가득하시길 바라겠습니다!');
INSERT INTO S10P12A606.script (script_id, script_title, script_content) VALUES (2, '싸탈 축하', 'OO아, 싸탈 축하해!!
싸피에서 너와 함께할 수 있어서 너무 즐겁고 감사했어.
앞으로 싸피에서 볼 수는 없겠지만 너의 새로운 시작을 진심으로 축하해.
나도 곧 따라간다!!');
INSERT INTO S10P12A606.script (script_id, script_title, script_content) VALUES (3, '생일 축하', 'OO아, 생일 축하해!! 싸피에서 너를 알게 돼서 너무 좋아.
함께 싸피에서 폭풍 성장해서 취뽀하자!
오늘 하루 한순간도 빠짐없이 행복하고 즐거웠으면 좋겠다!!
생일 축하해!');
INSERT INTO S10P12A606.script (script_id, script_title, script_content) VALUES (4, '프로젝트 마무리', '6주 동안 OO 프로젝트 하시느라 정말 수고가 많으셨습니다!
힘들었지만 그만큼 성장하고 배울 수 있어서 감사한 시간이었어요.
이 경험을 발판 삼아 모두 훌륭한 개발자로 성장하시기를 진심으로 응원합니다.
정말 고생하셨습니다! 화이팅!!');
