-- Theatre Booking Sample Seed Data
-- For development and testing purposes only

USE theater_booking_db;

INSERT INTO theatres (name, location) VALUES
  ('Grand Theatre',       'City Centre, Athens'),
  ('Apollo Stage',        'Thessaloniki Old Town'),
  ('Odeon Amphitheatre',  'Piraeus, Athens');

INSERT INTO shows (title, description, duration, age_rating, theatre_id) VALUES
  ('Hamlet',        'Shakespeare''s classic tragedy of revenge and madness.', 180, '15+', 1),
  ('The Lion King', 'Disney''s beloved musical adaptation.',                  150, 'PG',  2),
  ('Grease',        'The iconic 1950s rock-and-roll romance musical.',        135, 'PG',  3),
  ('Macbeth',       'A tale of ambition, power, and guilt.',                  165, '15+', 1),
  ('Mamma Mia',     'ABBA''s greatest hits woven into a joyful story.',       140, 'PG',  2);

INSERT INTO showtimes (show_date, show_time, hall_name, price, total_seats, available_seats, show_id) VALUES
  ('2026-06-01', '19:00:00', 'Main Hall', 35.00, 200, 200, 1),
  ('2026-06-02', '19:00:00', 'Main Hall', 35.00, 200, 200, 1),
  ('2026-06-05', '20:00:00', 'Stage A',   28.50, 150, 150, 2),
  ('2026-06-06', '15:00:00', 'Stage A',   28.50, 150, 150, 2),
  ('2026-06-10', '19:30:00', 'Hall B',    22.00, 120, 120, 3),
  ('2026-06-12', '19:30:00', 'Hall B',    22.00, 120, 120, 3),
  ('2026-06-15', '18:00:00', 'Main Hall', 40.00, 200, 200, 4),
  ('2026-06-20', '19:00:00', 'Stage A',   30.00, 150, 150, 5);
