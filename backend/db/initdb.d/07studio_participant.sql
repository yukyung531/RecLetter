CREATE TABLE IF NOT EXISTS studio_participant (
    studio_id char(36),
    user_id char(36),
    PRIMARY KEY(studio_id, user_id),
    FOREIGN KEY(studio_id) REFERENCES studio(studio_id) ON DELETE CASCADE ,
    FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;