CREATE TABLE IF NOT EXISTS bgm
(
    bgm_id  int primary key auto_increment,
    bgm_title varchar(100) not null,
    bgm_url varchar(8200)
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

insert into S10P12A606.bgm(bgm_title, bgm_url)
values ("bgm 없음", ""),
       ("SellBuyMusic - C. Hunter - Possum And Taters", "/src/assets/bgm/bgm01"),
       ("SellBuyMusic - C. Hunter - Possum And Taters_1", "/src/assets/bgm/bgm02"),
       ("SellBuyMusic - C. Hunter - Possum And Taters_4", "/src/assets/bgm/bgm03"),
       ("SellBuyMusic - Ending", "/src/assets/bgm/bgm04"),
       ("SellBuyMusic - hiro-in", "/src/assets/bgm/bgm05"),
       ("SellBuyMusic - hiro-out", "/src/assets/bgm/bgm06"),
       ("SellBuyMusic - 베르디 _ 오페라 ''라트라비아타'' 中 축배의 노래 intro", "/src/assets/bgm/bgm07"),
       ("SellBuyMusic - 자신감", "/src/assets/bgm/bgm08"),
       ("SellBuyMusic - 차이코프스키 - 어린이를 위한 앨범 5번 군대행진곡_2", "/src/assets/bgm/bgm09"),
       ("SellBuyMusic - 통통톡톡", "/src/assets/bgm/bgm10"),
       ("SellBuyMusic - 팝인트로", "/src/assets/bgm/bgm11"),
       ("SellBuyMusic - 하와이의 별내리는 밤", "/src/assets/bgm/bgm12"),
       ("SellBuyMusic - 해변의 저녁", "/src/assets/bgm/bgm13"),
       ("SellBuyMusic - 화창한 날", "/src/assets/bgm/bgm14"),
       ("배달의민족 - 배달은 자신있어", "/src/assets/bgm/bgm15"),
       ("배달의민족 - 선물하러 가는 길", "/src/assets/bgm/bgm16"),
       ("배달의민족 - 충전할 땐 클래식을", "/src/assets/bgm/bgm17"),
       ("배달의민족 - 큰집 18층으로 떠나는 여행", "/src/assets/bgm/bgm18");