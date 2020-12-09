CREATE TYPE engagement_types AS ENUM (
  'extensions',
  'tax returns'
);

CREATE TYPE status_types AS ENUM (
  'pending',
  'started',
  'review',
  'revision',
  'FINAL'
);

CREATE TABLE filing_years (
  filing_year_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  client_id INTEGER REFERENCES clients(client_id) ON DELETE CASCADE NOT NULL,
  year_end DATE NOT NULL,
  filing_year SMALLINT NOT NULL
);

CREATE TABLE engagements (
  engagement_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  filing_year_id INTEGER REFERENCES filing_years(filing_year_id) ON DELETE CASCADE NOT NULL,
  engagement_type engagement_types NOT NULL,
  engagement_status status_types NOT NULL
);