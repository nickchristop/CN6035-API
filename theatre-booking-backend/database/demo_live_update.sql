-- Theatre Booking Demo Data Live Update
-- Run this against an already-created local MariaDB database.
-- It updates known sample theatres, inserts missing demo theatres/shows/showtimes,
-- and avoids deleting live reservations or changing the schema.

USE theater_booking_db;

UPDATE theatres
SET name = 'Pallas Theatre',
    location = 'Athens - Address: Voukourestiou 5'
WHERE name = 'Apollo Stage'
  AND NOT EXISTS (
    SELECT 1
    FROM (SELECT theatre_id FROM theatres WHERE name = 'Pallas Theatre') AS existing_pallas
  )
LIMIT 1;

UPDATE theatres
SET name = 'Theatre of Neos Kosmos',
    location = 'Athens - Address: Antisthenous & Tharypou'
WHERE name = 'Apollo Stage'
  AND NOT EXISTS (
    SELECT 1
    FROM (SELECT theatre_id FROM theatres WHERE name = 'Theatre of Neos Kosmos') AS existing_neos
  )
LIMIT 1;

DROP TEMPORARY TABLE IF EXISTS demo_theatres;
CREATE TEMPORARY TABLE demo_theatres (
  name     VARCHAR(100) PRIMARY KEY,
  location VARCHAR(255) NOT NULL
);

INSERT INTO demo_theatres (name, location) VALUES
  ('Alsos Theatre', 'Athens - Address: Evelpidon 4'),
  ('Municipal Theater of Piraeus', 'Piraeus - Address: Iroon Polytechneiou 32'),
  ('Pallas Theatre', 'Athens - Address: Voukourestiou 5'),
  ('Theatre of Neos Kosmos', 'Athens - Address: Antisthenous & Tharypou'),
  ('Acropol Theatre', 'Athens - Address: Ippokratous 9-11'),
  ('Vretania Theatre', 'Athens - Address: Panepistimiou 7'),
  ('Athens Concert Hall', 'Athens - Address: Vasilissis Sofias & Kokkali');

INSERT INTO theatres (name, location)
SELECT dt.name, dt.location
FROM demo_theatres dt
WHERE NOT EXISTS (
  SELECT 1
  FROM theatres t
  WHERE t.name = dt.name
);

UPDATE theatres t
JOIN demo_theatres dt ON dt.name = t.name
SET t.location = dt.location;

DROP TEMPORARY TABLE IF EXISTS demo_shows;
CREATE TEMPORARY TABLE demo_shows (
  title        VARCHAR(100) NOT NULL,
  theatre_name VARCHAR(100) NOT NULL,
  description  VARCHAR(255),
  duration     INT NOT NULL,
  age_rating   VARCHAR(10),
  PRIMARY KEY (title, theatre_name)
);

INSERT INTO demo_shows (title, theatre_name, description, duration, age_rating) VALUES
  ('Hamlet', 'Alsos Theatre', 'Shakespeare''s classic tragedy of revenge and duty.', 160, '15+'),
  ('The Glass Menagerie', 'Alsos Theatre', 'A memory play about family, escape, and fragile hopes.', 105, '12+'),
  ('Grease', 'Municipal Theater of Piraeus', 'A lively 1950s rock-and-roll musical romance.', 135, 'PG'),
  ('The Cherry Orchard', 'Municipal Theater of Piraeus', 'Chekhov''s bittersweet comedy about change and family legacy.', 140, '12+'),
  ('The Lion King', 'Pallas Theatre', 'A family musical with vivid staging and memorable songs.', 150, 'PG'),
  ('Mamma Mia', 'Pallas Theatre', 'A sunny musical built around ABBA classics.', 140, 'PG'),
  ('A Midsummer Night''s Dream', 'Theatre of Neos Kosmos', 'A playful Shakespeare comedy of love, magic, and mistaken identity.', 120, 'PG'),
  ('Waiting for Godot', 'Theatre of Neos Kosmos', 'Beckett''s spare and darkly comic modern classic.', 110, '12+'),
  ('Macbeth', 'Acropol Theatre', 'A tense tragedy of ambition, power, and guilt.', 150, '15+'),
  ('Art', 'Vretania Theatre', 'A sharp comedy about friendship, taste, and one very expensive painting.', 90, 'PG'),
  ('The Nutcracker', 'Athens Concert Hall', 'A festive ballet for the whole family.', 115, 'PG'),
  ('Swan Lake', 'Athens Concert Hall', 'A classic ballet of romance, transformation, and betrayal.', 130, 'PG');

UPDATE shows s
JOIN demo_shows ds ON ds.title = s.title
JOIN theatres target_theatre ON target_theatre.name = ds.theatre_name
LEFT JOIN shows existing_target
  ON existing_target.title = ds.title
 AND existing_target.theatre_id = target_theatre.theatre_id
 AND existing_target.show_id <> s.show_id
SET s.description = ds.description,
    s.duration = ds.duration,
    s.age_rating = ds.age_rating,
    s.theatre_id = target_theatre.theatre_id
WHERE existing_target.show_id IS NULL;

INSERT INTO shows (title, description, duration, age_rating, theatre_id)
SELECT ds.title, ds.description, ds.duration, ds.age_rating, t.theatre_id
FROM demo_shows ds
JOIN theatres t ON t.name = ds.theatre_name
WHERE NOT EXISTS (
  SELECT 1
  FROM shows s
  WHERE s.title = ds.title
    AND s.theatre_id = t.theatre_id
);

DROP TEMPORARY TABLE IF EXISTS demo_showtimes;
CREATE TEMPORARY TABLE demo_showtimes (
  title           VARCHAR(100) NOT NULL,
  theatre_name    VARCHAR(100) NOT NULL,
  show_date       DATE NOT NULL,
  show_time       TIME NOT NULL,
  hall_name       VARCHAR(50),
  price           DECIMAL(8,2) NOT NULL,
  total_seats     INT NOT NULL,
  available_seats INT NOT NULL
);

INSERT INTO demo_showtimes (title, theatre_name, show_date, show_time, hall_name, price, total_seats, available_seats) VALUES
  ('Hamlet', 'Alsos Theatre', '2026-05-22', '19:30:00', 'Main Stage', 28.00, 420, 420),
  ('Hamlet', 'Alsos Theatre', '2026-05-23', '19:30:00', 'Main Stage', 30.00, 420, 420),
  ('Hamlet', 'Alsos Theatre', '2026-05-24', '18:00:00', 'Main Stage', 32.00, 420, 420),
  ('The Glass Menagerie', 'Alsos Theatre', '2026-05-29', '20:00:00', 'Studio Stage', 22.00, 180, 180),
  ('The Glass Menagerie', 'Alsos Theatre', '2026-05-30', '20:00:00', 'Studio Stage', 22.00, 180, 180),
  ('The Glass Menagerie', 'Alsos Theatre', '2026-05-31', '18:30:00', 'Studio Stage', 24.00, 180, 180),
  ('Grease', 'Municipal Theater of Piraeus', '2026-06-03', '19:30:00', 'Central Stage', 24.00, 600, 600),
  ('Grease', 'Municipal Theater of Piraeus', '2026-06-04', '19:30:00', 'Central Stage', 24.00, 600, 600),
  ('Grease', 'Municipal Theater of Piraeus', '2026-06-06', '17:00:00', 'Central Stage', 26.00, 600, 600),
  ('The Cherry Orchard', 'Municipal Theater of Piraeus', '2026-06-05', '20:00:00', 'Central Stage', 26.00, 600, 600),
  ('The Cherry Orchard', 'Municipal Theater of Piraeus', '2026-06-06', '20:00:00', 'Central Stage', 28.00, 600, 600),
  ('The Cherry Orchard', 'Municipal Theater of Piraeus', '2026-06-07', '18:00:00', 'Central Stage', 28.00, 600, 600),
  ('The Lion King', 'Pallas Theatre', '2026-06-10', '19:30:00', 'Grand Hall', 38.00, 900, 900),
  ('The Lion King', 'Pallas Theatre', '2026-06-11', '19:30:00', 'Grand Hall', 38.00, 900, 900),
  ('The Lion King', 'Pallas Theatre', '2026-06-13', '17:00:00', 'Grand Hall', 42.00, 900, 900),
  ('Mamma Mia', 'Pallas Theatre', '2026-06-12', '20:00:00', 'Grand Hall', 36.00, 900, 900),
  ('Mamma Mia', 'Pallas Theatre', '2026-06-13', '20:00:00', 'Grand Hall', 38.00, 900, 900),
  ('Mamma Mia', 'Pallas Theatre', '2026-06-14', '18:00:00', 'Grand Hall', 38.00, 900, 900),
  ('A Midsummer Night''s Dream', 'Theatre of Neos Kosmos', '2026-06-17', '20:30:00', 'Black Box', 20.00, 220, 220),
  ('A Midsummer Night''s Dream', 'Theatre of Neos Kosmos', '2026-06-18', '20:30:00', 'Black Box', 20.00, 220, 220),
  ('A Midsummer Night''s Dream', 'Theatre of Neos Kosmos', '2026-06-20', '18:30:00', 'Black Box', 22.00, 220, 220),
  ('Waiting for Godot', 'Theatre of Neos Kosmos', '2026-06-19', '21:00:00', 'Black Box', 18.00, 220, 220),
  ('Waiting for Godot', 'Theatre of Neos Kosmos', '2026-06-20', '21:00:00', 'Black Box', 20.00, 220, 220),
  ('Waiting for Godot', 'Theatre of Neos Kosmos', '2026-06-21', '19:00:00', 'Black Box', 20.00, 220, 220),
  ('Macbeth', 'Acropol Theatre', '2026-06-24', '20:00:00', 'Main Stage', 30.00, 450, 450),
  ('Macbeth', 'Acropol Theatre', '2026-06-25', '20:00:00', 'Main Stage', 30.00, 450, 450),
  ('Macbeth', 'Acropol Theatre', '2026-06-27', '18:30:00', 'Main Stage', 32.00, 450, 450),
  ('Art', 'Vretania Theatre', '2026-06-26', '20:30:00', 'Orchestra', 25.00, 350, 350),
  ('Art', 'Vretania Theatre', '2026-06-27', '20:30:00', 'Orchestra', 25.00, 350, 350),
  ('Art', 'Vretania Theatre', '2026-06-28', '18:00:00', 'Orchestra', 27.00, 350, 350),
  ('The Nutcracker', 'Athens Concert Hall', '2026-07-01', '19:00:00', 'Christos Lambrakis Hall', 42.00, 1200, 1200),
  ('The Nutcracker', 'Athens Concert Hall', '2026-07-02', '19:00:00', 'Christos Lambrakis Hall', 42.00, 1200, 1200),
  ('The Nutcracker', 'Athens Concert Hall', '2026-07-04', '17:00:00', 'Christos Lambrakis Hall', 45.00, 1200, 1200),
  ('Swan Lake', 'Athens Concert Hall', '2026-07-03', '20:00:00', 'Christos Lambrakis Hall', 44.00, 1200, 1200),
  ('Swan Lake', 'Athens Concert Hall', '2026-07-04', '20:00:00', 'Christos Lambrakis Hall', 46.00, 1200, 1200),
  ('Swan Lake', 'Athens Concert Hall', '2026-07-05', '18:30:00', 'Christos Lambrakis Hall', 46.00, 1200, 1200);

INSERT INTO showtimes (show_date, show_time, hall_name, price, total_seats, available_seats, show_id)
SELECT dst.show_date,
       dst.show_time,
       dst.hall_name,
       dst.price,
       dst.total_seats,
       dst.available_seats,
       s.show_id
FROM demo_showtimes dst
JOIN theatres t ON t.name = dst.theatre_name
JOIN shows s ON s.title = dst.title AND s.theatre_id = t.theatre_id
WHERE NOT EXISTS (
  SELECT 1
  FROM showtimes st
  WHERE st.show_id = s.show_id
    AND st.show_date = dst.show_date
    AND st.show_time = dst.show_time
);

DROP TEMPORARY TABLE IF EXISTS demo_showtimes;
DROP TEMPORARY TABLE IF EXISTS demo_shows;
DROP TEMPORARY TABLE IF EXISTS demo_theatres;
