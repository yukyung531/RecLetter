CREATE TABLE IF NOT EXISTS studio (
    studio_id char(36) primary key,
    studio_title varchar(50) not null,
    studio_owner varchar(16),
    expire_date timestamp not null,
    studio_frame_id int not null default 1,
    studio_font_id int not null default 1,
    studio_font_size int not null default 20,
    studio_font_bold bool default false,
    studio_bgm_id int not null default 1,
    studio_volume int not null default 100 CHECK ( studio_volume between 1 and 200),
    is_completed bool not null default false,
    FOREIGN KEY(studio_owner) REFERENCES user(user_id) ON DELETE SET NULL ,
    FOREIGN KEY(studio_frame_id) REFERENCES frame(frame_id),
    FOREIGN KEY(studio_bgm_id) REFERENCES bgm(bgm_id),
    FOREIGN KEY(studio_font_id) REFERENCES font(font_id)
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;