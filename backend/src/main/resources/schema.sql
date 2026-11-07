CREATE TABLE IF NOT EXISTS app_user (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  created_at VARCHAR(40) NOT NULL,
  password_salt VARCHAR(128) NOT NULL,
  password_hash VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS login_event (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  email VARCHAR(320) NOT NULL,
  logged_at VARCHAR(40) NOT NULL,
  CONSTRAINT fk_login_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_result (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  user_email VARCHAR(320) NOT NULL,
  module_id INTEGER NOT NULL,
  topic_title VARCHAR(200) NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  attempted_at VARCHAR(40) NOT NULL,
  CONSTRAINT fk_result_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_record (
  user_id VARCHAR(36) PRIMARY KEY,
  completed_topic_ids LONGTEXT NOT NULL,
  bookmarked_topic_ids LONGTEXT NOT NULL,
  CONSTRAINT fk_learning_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);
