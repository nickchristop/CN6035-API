-- Theatre Booking Sample Seed Data
-- For development and testing purposes only
-- Theatre addresses are kept in the location text because the schema has no address column.

USE theater_booking_db;

INSERT INTO theatres (name, location) VALUES
  ('Alsos Theatre', 'Athens - Address: Evelpidon 4'),
  ('Municipal Theater of Piraeus', 'Piraeus - Address: Iroon Polytechneiou 32'),
  ('Pallas Theatre', 'Athens - Address: Voukourestiou 5'),
  ('Theatre of Neos Kosmos', 'Athens - Address: Antisthenous & Tharypou'),
  ('Acropol Theatre', 'Athens - Address: Ippokratous 9-11'),
  ('Vretania Theatre', 'Athens - Address: Panepistimiou 7'),
  ('Athens Concert Hall', 'Athens - Address: Vasilissis Sofias & Kokkali');

INSERT INTO shows (title, description, duration, age_rating, theatre_id) VALUES
  ('Hamlet', 'Shakespeare''s classic tragedy of revenge and duty.', 160, '15+', 1),
  ('The Glass Menagerie', 'A memory play about family, escape, and fragile hopes.', 105, '12+', 1),
  ('Grease', 'A lively 1950s rock-and-roll musical romance.', 135, 'PG', 2),
  ('The Cherry Orchard', 'Chekhov''s bittersweet comedy about change and family legacy.', 140, '12+', 2),
  ('The Lion King', 'A family musical with vivid staging and memorable songs.', 150, 'PG', 3),
  ('Mamma Mia', 'A sunny musical built around ABBA classics.', 140, 'PG', 3),
  ('A Midsummer Night''s Dream', 'A playful Shakespeare comedy of love, magic, and mistaken identity.', 120, 'PG', 4),
  ('Waiting for Godot', 'Beckett''s spare and darkly comic modern classic.', 110, '12+', 4),
  ('Macbeth', 'A tense tragedy of ambition, power, and guilt.', 150, '15+', 5),
  ('Art', 'A sharp comedy about friendship, taste, and one very expensive painting.', 90, 'PG', 6),
  ('The Nutcracker', 'A festive ballet for the whole family.', 115, 'PG', 7),
  ('Swan Lake', 'A classic ballet of romance, transformation, and betrayal.', 130, 'PG', 7);

INSERT INTO showtimes (show_date, show_time, hall_name, price, total_seats, available_seats, show_id) VALUES
  ('2026-05-22', '19:30:00', 'Main Stage', 28.00, 420, 420, 1),
  ('2026-05-23', '19:30:00', 'Main Stage', 30.00, 420, 420, 1),
  ('2026-05-24', '18:00:00', 'Main Stage', 32.00, 420, 420, 1),
  ('2026-05-29', '20:00:00', 'Studio Stage', 22.00, 180, 180, 2),
  ('2026-05-30', '20:00:00', 'Studio Stage', 22.00, 180, 180, 2),
  ('2026-05-31', '18:30:00', 'Studio Stage', 24.00, 180, 180, 2),
  ('2026-06-03', '19:30:00', 'Central Stage', 24.00, 600, 600, 3),
  ('2026-06-04', '19:30:00', 'Central Stage', 24.00, 600, 600, 3),
  ('2026-06-06', '17:00:00', 'Central Stage', 26.00, 600, 600, 3),
  ('2026-06-05', '20:00:00', 'Central Stage', 26.00, 600, 600, 4),
  ('2026-06-06', '20:00:00', 'Central Stage', 28.00, 600, 600, 4),
  ('2026-06-07', '18:00:00', 'Central Stage', 28.00, 600, 600, 4),
  ('2026-06-10', '19:30:00', 'Grand Hall', 38.00, 900, 900, 5),
  ('2026-06-11', '19:30:00', 'Grand Hall', 38.00, 900, 900, 5),
  ('2026-06-13', '17:00:00', 'Grand Hall', 42.00, 900, 900, 5),
  ('2026-06-12', '20:00:00', 'Grand Hall', 36.00, 900, 900, 6),
  ('2026-06-13', '20:00:00', 'Grand Hall', 38.00, 900, 900, 6),
  ('2026-06-14', '18:00:00', 'Grand Hall', 38.00, 900, 900, 6),
  ('2026-06-17', '20:30:00', 'Black Box', 20.00, 220, 220, 7),
  ('2026-06-18', '20:30:00', 'Black Box', 20.00, 220, 220, 7),
  ('2026-06-20', '18:30:00', 'Black Box', 22.00, 220, 220, 7),
  ('2026-06-19', '21:00:00', 'Black Box', 18.00, 220, 220, 8),
  ('2026-06-20', '21:00:00', 'Black Box', 20.00, 220, 220, 8),
  ('2026-06-21', '19:00:00', 'Black Box', 20.00, 220, 220, 8),
  ('2026-06-24', '20:00:00', 'Main Stage', 30.00, 450, 450, 9),
  ('2026-06-25', '20:00:00', 'Main Stage', 30.00, 450, 450, 9),
  ('2026-06-27', '18:30:00', 'Main Stage', 32.00, 450, 450, 9),
  ('2026-06-26', '20:30:00', 'Orchestra', 25.00, 350, 350, 10),
  ('2026-06-27', '20:30:00', 'Orchestra', 25.00, 350, 350, 10),
  ('2026-06-28', '18:00:00', 'Orchestra', 27.00, 350, 350, 10),
  ('2026-07-01', '19:00:00', 'Christos Lambrakis Hall', 42.00, 1200, 1200, 11),
  ('2026-07-02', '19:00:00', 'Christos Lambrakis Hall', 42.00, 1200, 1200, 11),
  ('2026-07-04', '17:00:00', 'Christos Lambrakis Hall', 45.00, 1200, 1200, 11),
  ('2026-07-03', '20:00:00', 'Christos Lambrakis Hall', 44.00, 1200, 1200, 12),
  ('2026-07-04', '20:00:00', 'Christos Lambrakis Hall', 46.00, 1200, 1200, 12),
  ('2026-07-05', '18:30:00', 'Christos Lambrakis Hall', 46.00, 1200, 1200, 12);
