CREATE TYPE entity_types AS ENUM (
  'C-Corp',
  'S-Corp',
  'Partnership',
  'LLC',
  'LLP'
);

CREATE TABLE clients (
  client_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  -- office_id INTEGER REFERENCES offices(office_id) NOT NULL,
  client_name VARCHAR(50) NOT NULL,
  entity_type entity_types NOT NULL,
  year_end DATE NOT NULL,
  client_status BOOLEAN NOT NULL,
  contact_first_name VARCHAR(30),
  contact_last_name VARCHAR(30),
  contact_phone_number VARCHAR(14),
  contact_email VARCHAR(50)
);

CREATE TABLE users_to_clients (
  user_to_client_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER REFERENCES taxhub_users(user_id) ON DELETE CASCADE NOT NULL,
  client_id INTEGER REFERENCES clients(client_id) ON DELETE CASCADE NOT NULL
);
