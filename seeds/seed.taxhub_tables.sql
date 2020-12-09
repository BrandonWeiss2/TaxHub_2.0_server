-- seed data: psql -U postgres -d taxhub-2.0 -f C:/Users/Brandon/projects/week_9/taxhub-2.0/server/seeds/seed.taxhub_tables.sql

BEGIN;

TRUNCATE
  state_extensions,
  state_tax_returns,
  parent_to_sub,
  entities,
  engagements,
  filing_years,
  users_to_clients,
  taxhub_users,
  access_levels,
  offices
  RESTART IDENTITY CASCADE;

INSERT INTO offices (office_id, office_city)
VALUES
  ('1', 'Cincinnati'),
  ('2', 'New York'),
  ('3', 'Chicago'),
  ('4', 'Denver'),
  ('5', 'San Fransico');

INSERT INTO access_levels (access_id, access_level)
VALUES
  ('1', 'user'),
  ('2', 'office admin'),
  ('3', 'account admin');

INSERT INTO taxhub_users (user_id, office_id, first_name, last_name, username, user_password, access_level)
VALUES
  ('1', '1', 'Brandon', 'Weiss', 'BrandonW', '$2a$12$4aXBAbdODaqPjgFV3A7fXetFPQWOOQE8sX7JAGC/jxrg25XQbC.NC', '3'),
  ('2', '1', 'Alice', 'Rusk', 'AliceR', '$2a$12$4aXBAbdODaqPjgFV3A7fXetFPQWOOQE8sX7JAGC/jxrg25XQbC.NC', '1'),
  ('3', '2', 'Sophie', 'Harper', 'SophieR', '$2a$12$4aXBAbdODaqPjgFV3A7fXetFPQWOOQE8sX7JAGC/jxrg25XQbC.NC', '1'),
  ('4', '3', 'Matt', 'Tollerg', 'MattT', '$2a$12$4aXBAbdODaqPjgFV3A7fXetFPQWOOQE8sX7JAGC/jxrg25XQbC.NC', '1');

INSERT INTO clients (client_id, office_id, client_name)
VALUES 
  ('1', '1', 'Vermont Industries'),
  ('2', '1', 'Big Steal Corp'),
  ('3', '2', 'Amazon Inc'),
  ('4', '3', 'Apple Corp');

INSERT INTO users_to_clients (user_to_client_id, user_id, client_id)
VALUES
  ('1', '1', '1'),
  ('2', '1', '2'),
  ('3', '1', '3'),
  ('4', '1', '4'), 
  ('5', '2', '1'),
  ('6', '2', '2'),
  ('7', '2', '3'),
  ('8', '3', '1'),
  ('9', '3', '2'),
  ('10', '4', '1');

INSERT INTO filing_years (filing_year_id, client_id, year_end, filing_year)
VALUES
  ('1', '1', '12/31/2019', '2019'),  
  ('2', '1', '12/31/2020', '2020'),
  ('3', '2', '12/31/2020', '2020');

INSERT INTO engagements (engagement_id, filing_year_id, engagement_type, engagement_status)
VALUES
  ('1', '1', 'extensions', 'FINAL'),
  ('2', '1', 'tax returns', 'FINAL'),
  ('3', '2', 'extensions', 'started'),
  ('4', '2', 'tax returns', 'pending'),
  ('5', '3', 'extensions', 'pending');

INSERT INTO entities (entity_id, client_id, legal_name, ein, filer, entity_type, active)
VALUES
  ('1', '1', 'Vermont Industries Inc and Subs', '92-1416428', 'true', 'C-Corp', 'true'),
  ('2', '1', 'Snow Sellers LLC', '74-4452742', 'false', 'LLC', 'true'),
  ('3', '1', 'Big Tree Corp.', '51-1456213', 'false', 'C-Corp', 'true'),
  ('4', '1', 'Syrup Makers Corp', '23-1625231', 'false', 'C-Corp', 'true'),
  ('5', '1', 'We Were Sold Inc.', '63-1236123', 'false', 'LLC', 'false'),
  ('6', '2', 'Big Steal Corp.', '13-1126230', 'true', 'C-Corp', 'true');

INSERT INTO parent_to_sub (parent_to_sub_id, filing_year_id, parent_id, sub_id)
VALUES
  ('1', '1', '1', '1'),
  ('2', '1', '1', '2'),
  ('3', '1', '1', '3'),
  ('4', '1', '2', '4'),
  ('5', '1', '2', '5'),
  ('6', '2', '1', '1'),
  ('7', '2', '1', '2'),
  ('8', '2', '1', '3'),
  ('9', '2', '2', '4'),
  ('10', '3', '6', '6');

INSERT INTO state_extensions (extension_id, engagement_id, entity_id, state_id, form_name, due_date, extension_status)
VALUES
  ('1', '1', '1', 'FL', 'F-7004', '6/30/2019', 'FINAL'),
  ('2', '1', '2', 'FL', 'F-7004', '6/30/2019', 'FINAL'),
  ('3', '1', '3', 'FL', 'F-7004', '6/30/2019', 'FINAL'),
  ('4', '1', '4', 'FL', 'F-7004', '6/30/2019', 'FINAL'),
  ('5', '1', '5', 'FL', 'F-7004', '6/30/2020', 'FINAL'),
  ('6', '3', '1', 'FL', 'F-7004', '6/30/2020', 'started'),
  ('7', '3', '2', 'FL', 'F-7004', '6/30/2020', 'review'),
  ('8', '3', '3', 'FL', 'F-7004', '6/30/2020', 'revision'),
  ('9', '3', '4', 'FL', 'F-7004', '6/30/2020', 'pending'),
  ('10', '5', '6', 'FL', 'F-7004', '6/30/2020', 'FINAL'); 

INSERT INTO state_tax_returns (state_tax_return_id, engagement_id, entity_id, state_id, form_name, extended, due_date, extended_due_date, tax_return_status)
VALUES
  ('1', '2', '1', 'FL', 'F-1120', 'true', '6/30/2019', '12/31/2019', 'FINAL'),
  ('2', '2', '2', 'FL', 'F-1120', 'true', '6/30/2019', '12/31/2019', 'FINAL'),
  ('3', '2', '3', 'FL', 'F-1120', 'true', '6/30/2019', '12/31/2019', 'FINAL'),
  ('4', '2', '4', 'FL', 'F-1120', 'true', '6/30/2019', '12/31/2019', 'FINAL'),
  ('5', '2', '5', 'FL', 'F-1120', 'true', '6/30/2019', '12/31/2019', 'FINAL'),
  ('6', '4', '1', 'FL', 'F-1120', 'true', '6/30/2019', '12/31/2020', 'pending'),
  ('7', '4', '2', 'FL', 'F-1120', 'true', '6/30/2019', '12/31/2020', 'pending'),
  ('8', '4', '3', 'FL', 'F-1120', 'true', '6/30/2019', '12/31/2020', 'pending'),
  ('9', '4', '4', 'FL', 'F-1120', 'true', '6/30/2019', '12/31/2020', 'pending');

COMMIT;


