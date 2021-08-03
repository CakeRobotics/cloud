CREATE TABLE users
(
    id SERIAL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(300) NOT NULL,
    type TEXT DEFAULT 'normal' CHECK (type IN ('admin', 'normal')),
    last_access TIMESTAMP,
    date_of_creation TIMESTAMP DEFAULT current_timestamp,
    PRIMARY KEY (id)
);

CREATE TABLE registration_tokens
(
    token TEXT NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    date_of_creation TIMESTAMP DEFAULT current_timestamp
);
