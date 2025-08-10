-- Employees table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('EMPLOYEE', 'MANAGER', 'ADMIN')) DEFAULT 'EMPLOYEE',
    department VARCHAR(50),
    store_id INT,
    date_joined DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Recognitions
CREATE TABLE recognitions (
    recognition_id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES employees(employee_id),
    receiver_id INT NOT NULL REFERENCES employees(employee_id),
    badge_type VARCHAR(50) NOT NULL,
    message TEXT,
    points_awarded INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Points balance
CREATE TABLE points_balance (
    employee_id INT PRIMARY KEY REFERENCES employees(employee_id),
    total_points INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rewards
CREATE TABLE rewards (
    reward_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    points_required INT NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Redemptions
CREATE TABLE redemptions (
    redemption_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(employee_id),
    reward_id INT NOT NULL REFERENCES rewards(reward_id),
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('PENDING', 'FULFILLED', 'CANCELLED')) DEFAULT 'PENDING'
);

-- leaderboard cache
CREATE TABLE leaderboard_cache (
    leaderboard_id SERIAL PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    employee_id INT NOT NULL REFERENCES employees(employee_id),
    points INT NOT NULL,
    rank_position INT NOT NULL
);

-- Indexes
CREATE INDEX idx_recognitions_receiver ON recognitions(receiver_id);
CREATE INDEX idx_recognitions_sender ON recognitions(sender_id);
CREATE INDEX idx_points_balance ON points_balance(total_points DESC);
CREATE INDEX idx_redemptions_employee ON redemptions(employee_id);
