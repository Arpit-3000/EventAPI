CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  datetime TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL
);

CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  event_id INTEGER REFERENCES events(id),
  UNIQUE(user_id, event_id)
);
