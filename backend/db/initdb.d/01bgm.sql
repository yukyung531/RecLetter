CREATE TABLE IF NOT EXISTS bgm
(
    bgm_id  int primary key auto_increment,
    bgm_title varchar(100) not null,
    bgm_url varchar(8200)
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

insert into S10P12A606.bgm(bgm_title, bgm_url)
values ("bgm 없음", ""),
       ("SellBuyMusic - C. Hunter - Possum And Taters", "/src/assets/bgm/bgm1"),
       ("SellBuyMusic - C. Hunter - Possum And Taters_1", "/src/assets/bgm/bgm2"),
       ("SellBuyMusic - C. Hunter - Possum And Taters_4", "/src/assets/bgm/bgm3"),
       ("SellBuyMusic - Ending", "/src/assets/bgm/bgm4"),
       ("SellBuyMusic - hiro-in", "/src/assets/bgm/bgm5"),
       ("SellBuyMusic - hiro-out", "/src/assets/bgm/bgm6"),
       ("SellBuyMusic - 베르디 _ 오페라 ''라트라비아타'' 中 축배의 노래 intro", "/src/assets/bgm/bgm7"),
       ("SellBuyMusic - 자신감", "/src/assets/bgm/bgm8"),
       ("SellBuyMusic - 차이코프스키 - 어린이를 위한 앨범 5번 군대행진곡_2", "/src/assets/bgm/bgm9"),
       ("SellBuyMusic - 통통톡톡", "/src/assets/bgm/bgm10"),
       ("SellBuyMusic - 팝인트로", "/src/assets/bgm/bgm11"),
       ("SellBuyMusic - 하와이의 별내리는 밤", "/src/assets/bgm/bgm12"),
       ("SellBuyMusic - 해변의 저녁", "/src/assets/bgm/bgm13"),
       ("SellBuyMusic - 화창한 날", "/src/assets/bgm/bgm14"),
       ("배달의민족 - 배달은 자신있어", "/src/assets/bgm/bgm15"),
       ("배달의민족 - 선물하러 가는 길", "/src/assets/bgm/bgm16"),
       ("배달의민족 - 충전할 땐 클래식을", "/src/assets/bgm/bgm17"),
       ("배달의민족 - 큰집 18층으로 떠나는 여행", "/src/assets/bgm/bgm18");