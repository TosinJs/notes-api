## Description

This repository contains the API logic for a Notes Application, built for the Uptick Backnd Developer challenge

## Deployment
A live deployment of this application can be found @ https://notes-api-u6bf.onrender.com/api

## Documentation
The documentation of this application can be found @:
<li>Open Api @ https://notes-api-u6bf.onrender.com/api/docs</li>

![Docs-Notes](https://user-images.githubusercontent.com/68669102/220770952-81b6b6f3-c18b-483c-a2c6-0e6c07241397.PNG)

## Run the Application Locally

```bash
# Clone the repository
$ git clone https://github.com/TosinJs/notes-api.git

# Install dependencies
$ npm install

# configuration 
# Create .env file in the root folder
$ touch .env

# populate the .env file with your files
$ MONGO_URI = "your mongodb connection string"
$ JWT_SECRET = "your JWT secret"
$ SALT_ROUNDS = "number of salt rounds"

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## Application Flow
<p>The business logic of this application is in the src/domains folder. The business logic is split into two services: </p>
<li>Users</li>
<li>Notes</li>

### Users
<p>The Users service contains all the logic for registeration and authentication of users </p>
<p>A JWT is retured to the user when they signup or login. The JWT is used to access the <strong>Notss</strong> service</p>
<p>Make a POST request with jwt credentials @ https://notes-api-u6bf.onrender.com/api/users/login to get the bearer token</p>

![login flow](https://user-images.githubusercontent.com/68669102/211182773-d4f712ac-9c4f-4520-97c1-48a918b3a7eb.PNG)

### Notes
<p>The Notes service contains all the logic for creating, getting, updating and deleting Notes</p>
<p>All the endpoints in the notes service are protected endpoints </p>
<p>The JWT is used to access the <strong>Notes</strong> service. Send this JWT with every request to a notes endpoint</p>
