CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lands (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    location VARCHAR(255) NOT NULL,
    area DECIMAL NOT NULL,
    coordinates VARCHAR(255) NOT NULL,
    is_registered BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    land_id INTEGER REFERENCES lands(id),
    seller_id INTEGER REFERENCES users(id),
    buyer_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blocks (
    id SERIAL PRIMARY KEY,
    index INTEGER NOT NULL UNIQUE,
    timestamp BIGINT NOT NULL,
    previous_hash VARCHAR(255) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    nonce INTEGER NOT NULL,
    transactions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demo Data
INSERT INTO users (name, email, password_hash)
VALUES 
('Demo User', 'demo@bhoomi.in', '$2a$10$xPGEKc1cLN3qJK8TkYex4eYwKC8vivbNEqSuGCkv8BNHV0OBMKBLq'),
('Admin User', 'admin@bhoomi.in', '$2a$10$8K1p/a0dL1LXMw0rvnB8aOJg.3Y8n0OqGkQF7v2FGnA9E9WT6PtW.')
ON CONFLICT (email) DO NOTHING;

INSERT INTO lands (owner_id, location, area, coordinates)
SELECT id, 'Plot 101, Tech Park, Bangalore', 5000.0, '12.9716, 77.5946' FROM users WHERE email = 'admin@bhoomi.in'
WHERE NOT EXISTS (SELECT 1 FROM lands WHERE location = 'Plot 101, Tech Park, Bangalore');

INSERT INTO lands (owner_id, location, area, coordinates)
SELECT id, 'Survey 42, Green Valley, Pune', 12000.5, '18.5204, 73.8567' FROM users WHERE email = 'demo@bhoomi.in'
WHERE NOT EXISTS (SELECT 1 FROM lands WHERE location = 'Survey 42, Green Valley, Pune');

INSERT INTO lands (owner_id, location, area, coordinates)
SELECT id, 'Block C, Industrial Area, Noida', 8500.0, '28.5355, 77.3910' FROM users WHERE email = 'admin@bhoomi.in'
WHERE NOT EXISTS (SELECT 1 FROM lands WHERE location = 'Block C, Industrial Area, Noida');

INSERT INTO blocks (index, timestamp, previous_hash, hash, nonce, transactions)
VALUES 
(0, 1690000000000, '0', 'genesis_hash', 0, '[]'::jsonb)
ON CONFLICT (index) DO NOTHING;
