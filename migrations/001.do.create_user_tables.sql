-- CREATE TABLE offices (
--   office_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
--   office_city VARCHAR(25) NOT NULL
-- );

-- CREATE TABLE access_levels (
--   access_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
--   access_level TEXT NOT NULL
-- );

CREATE TABLE taxhub_users (
  user_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  -- office_id INTEGER REFERENCES offices(office_id) DEFAULT 1 NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  username VARCHAR(25) NOT NULL,
  user_password VARCHAR(2000) NOT NULL
  -- access_level INTEGER REFERENCES access_levels(access_id) DEFAULT 1 NOT NULL
);

