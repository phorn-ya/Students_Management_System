# Student Management System

## Project structure

```text
Backend/
  src/         API source
  docs/        API test guide and Postman collection
  package.json
  .env.example
frontend/      React/Vite web application
```

The API test guide is in `Backend/docs/API_TEST_GUIDE.md`; import the Postman
collection from the same folder.

## Run with Laragon

1. Start **MySQL** from Laragon.
2. Create a database named `student_management_db` in HeidiSQL or phpMyAdmin.
3. Copy `Backend/.env.example` to `Backend/.env` and set your database variables:

   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=student_management_db
   DB_USER=root
   DB_PASSWORD=
   ```

   Leave `DB_PASSWORD` empty for a default Laragon installation, or set it to
   the password configured for your MySQL account.
4. Install dependencies and start the API:

   ```sh
   cd Backend
   npm install
   npm run dev
   ```

On startup, the server creates the application tables if they do not already
exist, then checks the database connection before listening on port `3000`.

## Run the frontend

Open a second terminal while the backend is running:

```sh
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite development server forwards `/api`
requests to the backend at `http://localhost:3000`. To use another backend,
update the proxy target in `frontend/vite.config.ts`.