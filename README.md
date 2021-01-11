#Tax Hub Api

This is the backend for Tax Hub. AA liver version of the app can be found at

The front end client can be found at https://github.com/BrandonWeiss2/TaxHub_2.0_client

Live link:  https://tax-hub-2-0-client.vercel.app/

Demo-Username: BrandonW

Demo-Password: Vermont!2077

INTRODUCTION: Why TaxHub

Welcome to TaxHub, your centralized home for all tax project managment purposes for Certified Public Accountatnts (CPAs)!

For those unfamiliar with the world of public accounting let me give you a quick introduction...

In tax, as a CPA you will be responsible for working on anywhere from 10 to 20 different clients throughout the year depending on the size and comlexity of the client. A client might be a single entity like a coporation, non-profit, llc, or consists of a massive web of connected entities including foreign operations. Depending on regulations and the type of entity there might be anywhere from 0 to or over 100+ forms that needed to be prepared. To make matters more complicated, each form has different due dates, which get only more complicated depending on the client's fiscal year end and whether or not an extension is requested.

As you can see there is a LOT to keep track of, and these deadlines have serious consequences if missed.

Unfortunatlely, the most common method deployed is an indiviual excel workbook, so if a CPA wants to check on upcoming due dates they will have to browse multiple excel workbooks, which is a tedious task before you account for the 80+ hour workweeks everyone is doing during busy season.

TaxHub is here to resolve this issue by allowing a CPA to list all their clients, their clients' entities, and their respective returns due dates in a single location so a CPA do a quick check in seconds rather than an hour. Letting the CPA focus more on preforming work and stress less about the possibility of missing a due date!

APP: Registration and Login

All fields are required and the password must meet specific requirements. Once the client recieves a valid response, the user will automatically be redirected to the login page where they will then enter their login information.

APP: Dashboard

After logging in, the user will be taken to the main dashboard, which will display all the clients the user has created or added to their account.

APP: Client

To add clients or create a new one, click on the "Client" link located at the top of the screen. There will be a button to create a new client at near the top right side of the screen. You can also add any client that another user has created by searching through the table in the center of screen.

APP: Client Overview

Each client will have its own overview page that can be accessed through the visit buttons on the dashboard or by clicking the eye icon in the client table. On the overview page, you will see basic client infromation, which can also be edited as needed.

APP: Engagements

All the clients engagements will be displayed in expandable tables. Each table will contain every entity associated with that client. From there you can see all the froms that exist for that specific engagement. You can add, edit, and delete forms as neccessary.

For those unfamilar with coporate tax, the Parent entity in a corporate structure is any entity that controls another. For this purposes, the parent is the very top entity in the corporate structure. However, this can be different from the Top Con entity, which is the highest entity in a corporate structure that ultimately files the federal return. (ex. Your parent might be a holding company that does not file, and your Top Con might be a C-Corp that is a subsidiary of that holding company)

APP: Entities

from the entities page, you can activate, deactivate, or create new entities as needed.he logout button, which will do just that. create entity page

TECHNOLOGY: Back End - Node and Express - Authentication via JWT - RESTful Api

Testing - Supertest (integration) - Mocha and Chai (unit)

Database - Postgres - Knex.js -SQL wrapper

Production - Deployed via Heroku

Set Up: Major dependencies for this repo include Postgres and Node.

To get setup locally, do the following:

Clone this repository to your machine, cd into the directory and run npm install

Create the dev and test databases: createdb -U postgres -d taxhub and createdb -U postgres -d taxhub-test

Create a .env file in the project root

Inside these files you'll need the following:

NODE_ENV=development const PORT = process.env.PORT || 8001 DB_URL="postgresql://postgres@localhost/TaxHub-2.0" TEST_DB_URL="postgresql://postgres@localhost/TaxHub-2.0-test" JWT_SECRET="mysecret"

Run the migrations for dev - npm run migrate Run the migrations for test - NODE_ENV=test npm run migrate Seed the database - psql -U -d taxhub -f ./seeds/seed.taxhub_tables.sql Run the tests - npm t Start the app - npm run dev b
