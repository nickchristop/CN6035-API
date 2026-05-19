# Demo Checklist

Use this as the live presentation run sheet.

## Terminals to Open

1. Backend terminal
2. Mobile/Expo terminal
3. MariaDB console
4. Optional Postman or browser tab for API fallback checks

## Backend

```powershell
cd C:/Users/nickc/WebstormProjects/CN6035-API/theatre-booking-backend
node server.js
```

Expected:

```text
Server running on http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

DB check:

```text
http://localhost:3000/db-test
```

## Mobile

```powershell
cd C:/Users/nickc/WebstormProjects/CN6035-API/theatre-booking-mobile
npx expo start
```

For Expo Go on a physical phone, make sure:

- Phone and development machine are on the same Wi-Fi.
- The API base URL uses the computer LAN IP and port `3000`.
- If needed, start Expo with:

```powershell
$env:EXPO_PUBLIC_API_BASE_URL="http://192.168.x.x:3000"
npx expo start
```

## Database Setup Check

If demo data needs refreshing:

```sql
SOURCE C:/Users/nickc/WebstormProjects/CN6035-API/theatre-booking-backend/database/demo_live_update.sql;
```

Keep these DB queries ready:

```sql
SELECT theatre_id, name, location
FROM theatres
ORDER BY theatre_id;

SELECT s.show_id, s.title, t.name AS theatre, COUNT(st.showtime_id) AS showtime_count
FROM shows s
JOIN theatres t ON s.theatre_id = t.theatre_id
LEFT JOIN showtimes st ON st.show_id = s.show_id
GROUP BY s.show_id, s.title, t.name
ORDER BY s.title;

SELECT reservation_id, user_id, showtime_id, seats_reserved, reservation_status
FROM reservations
ORDER BY reservation_id DESC
LIMIT 10;

SELECT showtime_id, total_seats, available_seats
FROM showtimes
WHERE showtime_id = <showtime_id>;
```

## Demo Account

Create the demo account through the app or API before the viva so the password is hashed.

| Name | Email | Password |
| --- | --- | --- |
| Demo User | `demo@example.com` | `DemoPass123!` |

Registration fallback:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/register" -ContentType "application/json" -Body '{"name":"Demo User","email":"demo@example.com","password":"DemoPass123!"}'
```

## Exact Demo Flow

1. Show backend health check at `http://localhost:3000/health`.
2. Open the mobile app.
3. Log in as the demo user.
4. Open `Venues`; point out real theatre names and address text.
5. Return home and open `Shows`.
6. Point out populated show cards, durations with `min`, and theatre names.
7. Open a show details screen.
8. Point out show metadata and at least three showtimes.
9. Choose a showtime and open the reservation screen.
10. Select seats in the visual seat map.
11. Create the reservation.
12. Open `My Reservations`.
13. Edit the seat count and save.
14. Cancel the reservation.
15. In MariaDB, show reservation status and available seat changes.

## Fallback Plan

If Expo Go has connectivity issues:

1. Use Postman or PowerShell to call the backend directly.
2. Register or log in and copy the JWT.
3. Call a public endpoint such as `GET /shows`.
4. Call a protected endpoint such as `GET /reservations/user` with `Authorization: Bearer <token>`.
5. Use the MariaDB console to show the database state.

Useful PowerShell fallback:

```powershell
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/login" -ContentType "application/json" -Body '{"email":"demo@example.com","password":"DemoPass123!"}'
$headers = @{ Authorization = "Bearer $($login.token)" }
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/reservations/user" -Headers $headers
```
