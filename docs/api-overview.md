# API Overview

Base URL during local development:

```text
http://localhost:3000
```

For Expo Go on a physical device, use the development machine's LAN IP instead:

```text
http://192.168.x.x:3000
```

Protected endpoints require:

```http
Authorization: Bearer <jwt>
```

## Endpoints

| Method | Path | Auth required | Request body | Response purpose |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/register` | No | `{ "name": "Demo User", "email": "demo@example.com", "password": "DemoPass123!" }` | Creates a user with a bcrypt-hashed password. |
| `POST` | `/auth/login` | No | `{ "email": "demo@example.com", "password": "DemoPass123!" }` | Returns a JWT and basic user details. |
| `GET` | `/theatres` | No | None | Returns all theatres. |
| `GET` | `/shows` | No | None | Returns all shows with theatre metadata. Supports query filters such as `title`, `theatre_id`, and `age_rating`. |
| `GET` | `/shows/:id` | No | None | Returns one show and its related showtimes. |
| `GET` | `/shows/showtimes` | No | None | Returns showtimes. Supports query filters such as `show_id`, `date`, and `available_only=true`. |
| `GET` | `/reservations/user` | Yes | None | Returns reservations for the authenticated user. |
| `POST` | `/reservations` | Yes | `{ "showtime_id": 1, "seats_reserved": 2 }` | Creates an active reservation and reduces `available_seats`. |
| `PUT` | `/reservations/:id` | Yes | `{ "seats_reserved": 3 }` | Updates seat count and adjusts `available_seats` by the difference. |
| `DELETE` | `/reservations/:id` | Yes | None | Cancels an active reservation and restores the reserved seats. |

## Example Requests

Register:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/register" -ContentType "application/json" -Body '{"name":"Demo User","email":"demo@example.com","password":"DemoPass123!"}'
```

Login:

```powershell
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/login" -ContentType "application/json" -Body '{"email":"demo@example.com","password":"DemoPass123!"}'
$token = $login.token
```

List shows:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/shows"
```

Get show details:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/shows/1"
```

Create reservation:

```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/reservations" -Headers $headers -ContentType "application/json" -Body '{"showtime_id":1,"seats_reserved":2}'
```

Update reservation:

```powershell
Invoke-RestMethod -Method Put -Uri "http://localhost:3000/reservations/1" -Headers $headers -ContentType "application/json" -Body '{"seats_reserved":3}'
```

Cancel reservation:

```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/reservations/1" -Headers $headers
```

## Notes

- JWTs are issued by `/auth/login` and expire after one hour.
- Reservation operations are scoped to the authenticated user.
- Reservation create/update/cancel operations update MariaDB showtime availability through backend service logic.
- The API does not expose a payment flow.
