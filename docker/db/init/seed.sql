-- Seed employees
INSERT INTO employees (employee_code, first_name, last_name, email, department, role, points) VALUES
('E1001','Alex','Johnson','alex.johnson@beststaff.local','Mobile Sales','EMPLOYEE', 120),
('E1002','Sam','Patel','sam.patel@beststaff.local','Geek Squad','EMPLOYEE', 80),
('E1003','Jamie','Nguyen','jamie.nguyen@beststaff.local','Home Theatre','MANAGER', 300),
('E1004','Riley','Chen','riley.chen@beststaff.local','Computers','EMPLOYEE', 0),
('E1005','Taylor','Brown','taylor.brown@beststaff.local','Appliances','ADMIN', 500);

-- Seed badges
INSERT INTO badges (code, name, description, point_value) VALUES
('TEAM_PLAYER','Team Player','Great collaboration and team spirit',50),
('SALES_STAR','Sales Star','Top sales performance',100),
('TECH_GURU','Tech Guru','Excellent technical support',75),
('CUSTOMER_HERO','Customer Hero','Outstanding customer feedback',80),
('MANAGER_BOOST','Manager Boost','Extra recognition from a manager',150);

-- A few recognitions to generate points history
INSERT INTO recognitions (sender_id, receiver_id, badge_id, note) VALUES
((SELECT id FROM employees WHERE employee_code='E1002'),
 (SELECT id FROM employees WHERE employee_code='E1001'),
 (SELECT id FROM badges WHERE code='TEAM_PLAYER'),
 'Thanks for jumping in on the closing shift!'),

((SELECT id FROM employees WHERE employee_code='E1003'),
 (SELECT id FROM employees WHERE employee_code='E1002'),
 (SELECT id FROM badges WHERE code='MANAGER_BOOST'),
 'Exceptional NPS this week!'),

((SELECT id FROM employees WHERE employee_code='E1001'),
 (SELECT id FROM employees WHERE employee_code='E1004'),
 (SELECT id FROM badges WHERE code='TECH_GURU'),
 'Saved a tricky repair—nice work!');
