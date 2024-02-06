CREATE TABLE IF NOT EXISTS clip (
    clip_id int primary key auto_increment,
    clip_title varchar(50) not null,
    clip_owner char(36),
    clip_order int not null default -1,
    clip_volume int not null default 100 CHECK ( clip_volume BETWEEN 1 AND 200),
    studio_id char(36),
    clip_content varchar(100),
    FOREIGN KEY(clip_owner) REFERENCES user(user_id) ON DELETE SET NULL,
    FOREIGN KEY(studio_id) REFERENCES studio(studio_id) ON DELETE CASCADE
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


#     clip_thumbnail_url varchar(8200),
#     clip_streaming_url varchar(8200),
#     clip_download_url varchar(8200),