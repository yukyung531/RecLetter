CREATE TABLE IF NOT EXISTS font (
    font_id int primary key auto_increment,
    font_title varchar(50) unique not null,
    font_family varchar(50) not null,
    font_url varchar(8200) not null
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

insert into S10P12A606.font(font_title, font_family, font_url) values
    ("오뮤다예쁨체(기본)", "omyu_pretty", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-01@1.0/omyu_pretty.woff2"),
    ("프리텐다드", "Pretendard-Regular", "https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff"),
    ("시원한 설레임체", "seolleimcool-SemiBold","https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-1@1.1/seolleimcool-SemiBold.woff2"),
    ("와글와글체", "WagleWagle", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2301-wagle@1.0/WagleWagle.woff"),
    ("OG 르네상스 비밀", "OG_Renaissance_Secret-Rg", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-1@1.1/OG_Renaissance_Secret-Rg.woff2"),
    ("Y클로버체", "YClover-Bold", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_231029@1.1/YClover-Bold.woff2"),
    ("여기어때 잘난체 고딕", "JalnanGothic", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_231029@1.1/JalnanGothic.woff"),
    ("태백은하수체", "TAEBAEKmilkyway", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2310@1.0/TAEBAEKmilkyway.woff2"),
    ("Orbit", "Orbit-Regular", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2310@1.0/Orbit-Regular.woff2"),
    ("소요단풍체", "SOYOMapleBoldTTF", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2310@1.0/SOYOMapleBoldTTF.woff2"),
    ("도스필기", "DOSPilgiMedium", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/DOSPilgiMedium.woff2"),
    ("둘기마요고딕", "Dovemayo_gothic", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.1/Dovemayo_gothic.woff2"),
    ("KCC간판체", "KCC-Ganpan", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/KCC-Ganpan.woff2"),
    ("거친둘기마요", "Dovemayo_wild", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/Dovemayo_wild.woff2"),
    ("나눔스퀘어 네오", "NanumSquareNeo-Variable", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/NanumSquareNeo-Variable.woff2"),
    ("LINE Seed", "LINESeedKR-Bd", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedKR-Bd.woff2"),
    ("제주돌담체", "EF_jejudoldam", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2210-EF@1.0/EF_jejudoldam.woff2"),
    ("카페24 써라운드", "Cafe24Ssurround", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/Cafe24Ssurround.woff"),
    ("완도희망체", "WandohopeR", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/WandohopeR.woff"),
    ("Rix할매의꽃담", "RixMomsBlanketR", "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/RixMomsBlanketR.woff2");
