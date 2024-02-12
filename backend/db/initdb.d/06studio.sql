CREATE TABLE IF NOT EXISTS studio (
    studio_id char(36) primary key,
    studio_title varchar(50) not null,
    studio_owner char(36),
    expire_date timestamp not null,
    studio_frame_id int not null default 1,
    studio_bgm_id int not null default 1,
    studio_bgm_volume int not null default 100 CHECK (studio_bgm_volume between 1 and 200),
    studio_status ENUM('INCOMPLETE', 'ENCODING', 'COMPLETE', 'FAIL') not null default  'INCOMPLETE',
    studio_sticker varchar(120),
    FOREIGN KEY(studio_owner) REFERENCES user(user_id) ON DELETE SET NULL ,
    FOREIGN KEY(studio_frame_id) REFERENCES frame(frame_id),
    FOREIGN KEY(studio_bgm_id) REFERENCES bgm(bgm_id)
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
