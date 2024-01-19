CREATE TABLE IF NOT EXISTS studio_participant (
    studio_id int,
    user_id varchar(16),
    PRIMARY KEY(studio_id, user_id),
    FOREIGN KEY(studio_id) REFERENCES studio(studio_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id)
)