CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS stores (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(400) NOT NULL,
    owner_id BIGINT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ratings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    store_id BIGINT NOT NULL REFERENCES stores(id),
    value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
    UNIQUE(user_id, store_id)
);

INSERT INTO users (name, email, password, address, role)
VALUES ('System Administrator', 'admin@gmail.com', 'Admin@123', 'Head Office, Delhi', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
