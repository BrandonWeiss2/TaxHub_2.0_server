-- seed data: psql -U postgres -d TaxHub-2.0 -f C:/Users/brand/OneDrive/Documents/projects/taxhub-2.0/server/seeds/seed.taxhub_tables.sql

BEGIN;

TRUNCATE
  extensions,
  tax_returns,
  parent_to_sub,
  entities,
  engagements,
  filing_years,
  users_to_clients,
  taxhub_users
  -- access_levels,
  -- offices
  RESTART IDENTITY CASCADE;

-- INSERT INTO offices (office_id, office_city)
-- VALUES
--   ('1', 'Cincinnati'),
--   ('2', 'New York'),
--   ('3', 'Chicago'),
--   ('4', 'Denver'),
--   ('5', 'San Fransico');

-- INSERT INTO access_levels (access_id, access_level)
-- VALUES
--   ('1', 'user'),
--   ('2', 'office admin'),
--   ('3', 'account admin');

INSERT INTO taxhub_users (user_id, first_name, last_name, username, user_password) 
VALUES
  ('1', 'Brandon', 'Weiss', 'BrandonW', '$2a$12$4aXBAbdODaqPjgFV3A7fXetFPQWOOQE8sX7JAGC/jxrg25XQbC.NC'),
  ('2', 'Alice', 'Rusk', 'AliceR', '$2a$12$4aXBAbdODaqPjgFV3A7fXetFPQWOOQE8sX7JAGC/jxrg25XQbC.NC'),
  ('3', 'Sophie', 'Harper', 'SophieR', '$2a$12$4aXBAbdODaqPjgFV3A7fXetFPQWOOQE8sX7JAGC/jxrg25XQbC.NC'),
  ('4', 'Matt', 'Tollerg', 'MattT', '$2a$12$4aXBAbdODaqPjgFV3A7fXetFPQWOOQE8sX7JAGC/jxrg25XQbC.NC');

INSERT INTO clients (client_id, client_name, entity_type, year_end, client_status)
VALUES 
  ('1', 'Vermont Industries', 'C-Corp', '2019-12-31', 'true'),
  ('2', 'Big Steal Corp', 'C-Corp', '2019-12-31', 'true'),
  ('3', 'Amazon Inc', 'C-Corp', '2019-12-31', 'true'),
  ('4', 'Apple Corp', 'C-Corp', '2019-12-31', 'true');

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
  ('1', '1', '2019-12-31', '2019'),  
  ('2', '1', '2020-12-31', '2020'),
  ('3', '2', '2020-12-31', '2020');

INSERT INTO engagements (engagement_id, filing_year_id, engagement_type, engagement_status)
VALUES
  ('1', '1', 'extensions', 'FINAL'),
  ('2', '1', 'tax_returns', 'FINAL'),
  ('3', '2', 'extensions', 'active'),
  ('4', '2', 'tax_returns', 'active'),
  ('5', '3', 'extensions', 'active');

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

INSERT INTO extensions (extension_id, engagement_id, entity_id, jurisdiction_id, form_name, due_date, completion_status)
VALUES
  ('1', '1', '1', 'FL', 'F-7004', '2019-6-30', 'FINAL'),
  ('2', '1', '2', 'FL', 'F-7004', '2019-6-30', 'FINAL'),
  ('3', '1', '3', 'FL', 'F-7004', '2019-6-30', 'FINAL'),
  ('4', '1', '4', 'FL', 'F-7004', '2019-6-30', 'FINAL'),
  ('5', '1', '5', 'FL', 'F-7004', '2020-6-30', 'FINAL'),
  ('6', '3', '1', 'FL', 'F-7004', '2020-6-30', 'started'),
  ('7', '3', '2', 'FL', 'F-7004', '2020-6-30', 'review'),
  ('8', '3', '3', 'FL', 'F-7004', '2020-6-30', 'revision'),
  ('9', '3', '4', 'FL', 'F-7004', '2020-6-30', 'FINAL'),
  ('10', '5', '6', 'FL', 'F-7004', '2020-6-30', 'FINAL'); 

INSERT INTO tax_returns (tax_return_id, engagement_id, entity_id, jurisdiction_id, form_name, extended, due_date, extended_due_date, completion_status)
VALUES
  ('1', '2', '1', 'FL', 'F-1120', 'true', '2019-6-30', '2019-12-31', 'FINAL'),
  ('2', '2', '2', 'FL', 'F-1120', 'true', '2019-6-30', '2019-12-31', 'FINAL'),
  ('3', '2', '3', 'FL', 'F-1120', 'true', '2019-6-30', '2019-12-31', 'FINAL'),
  ('4', '2', '4', 'FL', 'F-1120', 'true', '2019-6-30', '2019-12-31', 'FINAL'),
  ('5', '2', '5', 'FL', 'F-1120', 'true', '2019-6-30', '2019-12-31', 'FINAL'),
  ('6', '4', '1', 'FL', 'F-1120', 'true', '2019-6-30', '2020-12-31', 'pending'),
  ('7', '4', '2', 'FL', 'F-1120', 'true', '2019-6-30', '2020-12-31', 'pending'),
  ('8', '4', '3', 'FL', 'F-1120', 'true', '2019-6-30', '2020-12-31', 'FINAL'),
  ('9', '4', '4', 'FL', 'F-1120', 'true', '2019-6-30', '2020-12-31', 'pending');

COMMIT;


