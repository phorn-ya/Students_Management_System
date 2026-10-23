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

## Run with Docker Compose

1. Install and start Docker Desktop.
2. From the repository root, copy `.env.example` to `.env` and replace the
   example passwords and JWT secret with strong, private values. Do not commit
   `.env`.
3. Build and start MySQL, the API, and the frontend:

   ```powershell
   docker compose up --build -d
   ```

4. Open `http://localhost:8080`. The frontend's Nginx server serves the app and
   forwards `/api` requests to the backend.

To inspect service status and logs:

```powershell
docker compose ps
docker compose logs -f backend
```

Stop the services while preserving database data with
`docker compose down`. Database files are kept in the `mysql_data` volume; do
not use `docker compose down -v` unless you intend to delete that data.