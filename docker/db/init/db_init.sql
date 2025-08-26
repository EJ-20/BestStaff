CREATE TYPE user_role AS ENUM ('EMPLOYEE', 'MANAGER', 'ADMIN');

CREATE TABLE IF NOT EXISTS employees (
  id            BIGSERIAL PRIMARY KEY,
  employee_code VARCHAR(20) UNIQUE NOT NULL,
  first_name    VARCHAR(60) NOT NULL,
  last_name     VARCHAR(60) NOT NULL,
  email         VARCHAR(120) UNIQUE NOT NULL,
  department    VARCHAR(80) NOT NULL,
  role          user_role NOT NULL DEFAULT 'EMPLOYEE',
  points        INT NOT NULL DEFAULT 0 CHECK (points >= 0),
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_active ON employees(active);

CREATE TABLE badges (
  id           BIGSERIAL PRIMARY KEY,
  code         VARCHAR(40) UNIQUE NOT NULL,
  name         VARCHAR(100) NOT NULL,
  description  TEXT,
  point_value  INT NOT NULL CHECK (point_value >= 0),
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recognitions (
  id           BIGSERIAL PRIMARY KEY,
  sender_id    BIGINT NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  receiver_id  BIGINT NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  badge_id     BIGINT NOT NULL REFERENCES badges(id) ON DELETE RESTRICT,
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_sender_receiver DIFFERENT_DEFERRABLE CHECK (sender_id <> receiver_id) DEFERRABLE INITIALLY IMMEDIATE
);

ALTER TABLE recognitions DROP CONSTRAINT chk_sender_receiver;
ALTER TABLE recognitions ADD CONSTRAINT chk_sender_receiver CHECK (sender_id <> receiver_id);

CREATE INDEX idx_recognitions_receiver ON recognitions(receiver_id);
CREATE INDEX idx_recognitions_created  ON recognitions(created_at);
CREATE INDEX idx_recognitions_badge    ON recognitions(badge_id);

-- Trigger to add points to receiver when a recognition is created
CREATE OR REPLACE FUNCTION add_points_on_recognition()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE employees e
     SET points = e.points + b.point_value
    FROM badges b
   WHERE e.id = NEW.receiver_id
     AND b.id = NEW.badge_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_add_points_on_recognition
AFTER INSERT ON recognitions
FOR EACH ROW
EXECUTE FUNCTION add_points_on_recognition();

CREATE OR REPLACE VIEW v_monthly_points AS
SELECT
  r.receiver_id AS employee_id,
  DATE_TRUNC('month', r.created_at) AS month,
  SUM(b.point_value) AS points_earned
FROM recognitions r
JOIN badges b ON b.id = r.badge_id
WHERE r.created_at >= DATE_TRUNC('month', NOW())
GROUP BY r.receiver_id, DATE_TRUNC('month', r.created_at);
