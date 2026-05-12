-- Theatre Booking Database Schema
-- Retrospective: reflects the database structure used by the CN6035-API backend

CREATE DATABASE IF NOT EXISTS theater_booking_db;
USE theater_booking_db;

CREATE TABLE theatres (
  theatre_id  INT          AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  location    VARCHAR(255) NOT NULL
);

CREATE TABLE shows (
  show_id     INT          AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  description TEXT,
  duration    INT          NOT NULL COMMENT 'Duration in minutes',
  age_rating  VARCHAR(10),
  theatre_id  INT          NOT NULL,
  FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
);

CREATE TABLE showtimes (
  showtime_id      INT           AUTO_INCREMENT PRIMARY KEY,
  show_date        DATE          NOT NULL,
  show_time        TIME          NOT NULL,
  hall_name        VARCHAR(50),
  price            DECIMAL(8,2)  NOT NULL,
  total_seats      INT           NOT NULL,
  available_seats  INT           NOT NULL,
  show_id          INT           NOT NULL,
  FOREIGN KEY (show_id) REFERENCES shows(show_id)
);

CREATE TABLE users (
  user_id     INT          AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
  reservation_id      INT          AUTO_INCREMENT PRIMARY KEY,
  user_id             INT          NOT NULL,
  showtime_id         INT          NOT NULL,
  seats_reserved      INT          NOT NULL,
  reservation_status  VARCHAR(20)  DEFAULT 'active',
  created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(user_id),
  FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id)
);
