# Theatre Booking Coursework App

A full-stack theatre booking application built for the CN6035 Mobile & Distributed Systems coursework. The project demonstrates a React Native/Expo mobile client communicating with a Node.js/Express REST API backed by a MariaDB database.

The app supports account-based browsing and reservation management for theatre performances, including visual seat selection and database-backed seat availability updates.

## Coursework Context

- Module: CN6035 Mobile & Distributed Systems
- Application type: Mobile client plus distributed REST backend
- Backend: Node.js, Express, MariaDB
- Mobile client: React Native with Expo
- Main focus: authenticated mobile workflows, REST API integration, persistent data, and consistency when seats are reserved, updated, or cancelled

## Features

- User registration and login
- JWT authentication for protected reservation endpoints
- Theatre and show browsing
- Show details with related showtimes
- Visual seat selection in the mobile app
- Reservation creation
- Reservation history for the logged-in user
- Reservation update and cancellation
- MariaDB-backed seat availability consistency when reservations are created, edited, or cancelled

## Architecture

```text
React Native / Expo mobile app
        |
        | HTTP / JSON
        v
Node.js / Express REST API
        |
        | mysql2 connection pool
        v
MariaDB database
```

- The mobile client calls the REST API using Axios.
- Authentication uses JWTs returned by the backend login endpoint.
- Protected reservation routes require an `Authorization: Bearer <token>` header.
- Seat availability is stored in MariaDB and updated by backend reservation operations.

## Folder Structure

```text
.
|-- README.md
|-- docs/
|   |-- api-overview.md
|   `-- demo-checklist.md
|-- theatre-booking-backend/
|   |-- config/
|   |-- controllers/
|   |-- database/
|   |   |-- schema.sql
|   |   |-- seed.sql
|   |   `-- demo_live_update.sql
|   |-- middlewares/
|   |-- routes/
|   |-- services/
|   |-- package.json
|   `-- server.js
`-- theatre-booking-mobile/
    |-- components/
    |-- context/
    |-- navigation/
    |-- screens/
    |-- services/
    |-- utils/
    |-- package.json
    `-- App.js
```

## Backend Setup

From the backend folder:

```powershell
cd theatre-booking-backend
npm install
```

Create or check `theatre-booking-backend/.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_mariadb_user
DB_PASSWORD=your_mariadb_password
DB_NAME=theater_booking_db
DB_PORT=3306
JWT_SECRET=replace_with_a_local_secret
```

Start the backend:

```powershell
node server.js
```

The API runs on port `3000` by default:

- Health check: `http://localhost:3000/health`
- Root check: `http://localhost:3000/`
- DB check: `http://localhost:3000/db-test`

## Mobile Setup

From the mobile folder:

```powershell
cd theatre-booking-mobile
npm install
npx expo start
```

Open the app in Expo Go or an emulator from the Expo terminal screen.

For a physical phone using Expo Go, the phone must be on the same Wi-Fi network as the development machine. The mobile app must call the backend using the computer's LAN IP address, not `localhost`, because `localhost` on the phone points to the phone itself.

The mobile API client reads `EXPO_PUBLIC_API_BASE_URL` when provided, otherwise it falls back to the default value in `theatre-booking-mobile/services/api.js`.

PowerShell example:

```powershell
$env:EXPO_PUBLIC_API_BASE_URL="http://192.168.x.x:3000"
npx expo start
```

Replace `192.168.x.x` with the development machine's local IP address. Restart Expo if the API URL changes.

## Database Setup

Database name:

```text
theater_booking_db
```

SQL files:

- `theatre-booking-backend/database/schema.sql` creates the database tables.
- `theatre-booking-backend/database/seed.sql` provides a fresh demo dataset.
- `theatre-booking-backend/database/demo_live_update.sql` updates an already-populated local database with presentation-ready theatre, show, and showtime data without changing the schema.

From a MariaDB prompt, run the files with `SOURCE`. Adjust the absolute path if the repository is cloned elsewhere:

```sql
SOURCE C:/Users/nickc/WebstormProjects/CN6035-API/theatre-booking-backend/database/schema.sql;
SOURCE C:/Users/nickc/WebstormProjects/CN6035-API/theatre-booking-backend/database/seed.sql;
```

For the existing local demo database, run:

```sql
SOURCE C:/Users/nickc/WebstormProjects/CN6035-API/theatre-booking-backend/database/demo_live_update.sql;
```

Useful verification queries:

```sql
SELECT theatre_id, name, location FROM theatres ORDER BY theatre_id;

SELECT s.show_id, s.title, t.name AS theatre, COUNT(st.showtime_id) AS showtime_count
FROM shows s
JOIN theatres t ON s.theatre_id = t.theatre_id
LEFT JOIN showtimes st ON st.show_id = s.show_id
GROUP BY s.show_id, s.title, t.name
ORDER BY s.title;

SELECT showtime_id, show_id, show_date, show_time, available_seats
FROM showtimes
ORDER BY show_date, show_time
LIMIT 20;
```

## API Overview

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Create a user account with a hashed password |
| `POST` | `/auth/login` | No | Authenticate and return a JWT |
| `GET` | `/theatres` | No | List theatres |
| `GET` | `/shows` | No | List shows, optionally filtered |
| `GET` | `/shows/:id` | No | Get one show with its showtimes |
| `GET` | `/shows/showtimes` | No | List showtimes, optionally filtered |
| `GET` | `/reservations/user` | Yes | List reservations for the logged-in user |
| `POST` | `/reservations` | Yes | Create a reservation and reduce availability |
| `PUT` | `/reservations/:id` | Yes | Update seat count and adjust availability |
| `DELETE` | `/reservations/:id` | Yes | Cancel a reservation and restore availability |

See [docs/api-overview.md](docs/api-overview.md) for request examples.

## Demo Accounts

Accounts should be created through the mobile app or the `POST /auth/register` API endpoint so passwords are hashed with bcrypt. Do not insert plaintext passwords directly into the database.

Recommended account to prepare before the viva:

| Name | Email | Password |
| --- | --- | --- |
| Demo User | `demo@example.com` | `DemoPass123!` |

If your local database already has a different demo user, use the credentials created through the app/API.

Example API registration:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/register" -ContentType "application/json" -Body '{"name":"Demo User","email":"demo@example.com","password":"DemoPass123!"}'
```

## Demo Flow

1. Start MariaDB and confirm the demo data is loaded.
2. Start the backend with `node server.js`.
3. Start the mobile app with `npx expo start`.
4. Log in with the demo account.
5. Open `Venues` and show the real theatre names and address text.
6. Open `Shows` and show populated cards, durations, age ratings, and theatre names.
7. Open a show details screen and show the showtime list.
8. Select a showtime and create a reservation using the visual seat selector.
9. Open `My Reservations` and show the new booking.
10. Edit the seat count and confirm the reservation updates.
11. Cancel the reservation and confirm it is marked cancelled.
12. Verify seat availability changes in MariaDB.

Useful DB checks during the demo:

```sql
SELECT reservation_id, user_id, showtime_id, seats_reserved, reservation_status
FROM reservations
ORDER BY reservation_id DESC
LIMIT 10;

SELECT showtime_id, total_seats, available_seats
FROM showtimes
WHERE showtime_id = <showtime_id>;
```

## Troubleshooting

| Problem | Check |
| --- | --- |
| Invalid or expired token | Log out, then log in again to get a fresh JWT. Tokens expire after one hour. |
| Expo Go cannot reach the backend | Use the computer's LAN IP address, keep phone and computer on the same Wi-Fi, and confirm port `3000` is reachable. |
| Backend not responding | Confirm `node server.js` is running in `theatre-booking-backend`. |
| Database connection fails | Check `.env`, MariaDB service status, database name `theater_booking_db`, and `/db-test`. |
| Demo data looks sparse or stale | Run `theatre-booking-backend/database/demo_live_update.sql`. |
| Port already in use | Stop the existing process or change `PORT` in `.env` and update the mobile API base URL. |

## Known Limitations and Future Work

- No real payment flow is implemented.
- The visual seat map is a client-side selection experience; the database stores reservation seat counts and showtime availability, not persistent individual seat IDs.
- The project is configured for local development rather than production deployment.
- JWT secret and database credentials are local environment values and would need proper secret management for production.
- Future work could add admin tools, per-seat persistence, email confirmations, payment integration, and automated test coverage.

## Development History Transparency

Early backend work was completed before a strict feature-branch commit workflow was established. The repository history was later organised retrospectively to make the development stages clearer for review. Subsequent work has continued through regular feature-focused commits.
