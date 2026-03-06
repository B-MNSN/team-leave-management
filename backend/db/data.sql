USE leave_management;

-- =====================================
-- INSERT USERS
-- =====================================

INSERT INTO users (name, email, password, role) VALUES
('user1','user1@company.com','$2a$12$ve9zXHXTRHPp4IHUb4b8c.Hj6WM0sbjZUfEyu1ekIizva/5L0M2ke','EMPLOYEE'),
('user2','user2@company.com','$2a$12$ve9zXHXTRHPp4IHUb4b8c.Hj6WM0sbjZUfEyu1ekIizva/5L0M2ke','EMPLOYEE'),
('user3','user3@company.com','$2a$12$ve9zXHXTRHPp4IHUb4b8c.Hj6WM0sbjZUfEyu1ekIizva/5L0M2ke','EMPLOYEE'),
('manager','manager@company.com','$2a$12$ve9zXHXTRHPp4IHUb4b8c.Hj6WM0sbjZUfEyu1ekIizva/5L0M2ke','MANAGER');



-- =====================================
-- INSERT LEAVE TYPES
-- =====================================

INSERT INTO leave_types (name, code, annual_quota) VALUES
('Annual Leave','ANNUAL',10),
('Sick Leave','SICK',30),
('Personal Leave','PERSONAL',6);



-- =====================================
-- SAMPLE LEAVE REQUESTS
-- =====================================

INSERT INTO leave_requests
(user_id,leave_type_id,start_date,end_date,duration,total_days,reason,status,approved_by)
VALUES
(1,1,'2026-03-10','2026-03-12','FULL',3,'Vacation','APPROVED',4),

(1,2,'2026-02-20','2026-02-20','HALF_AM',0.5,'Flu','APPROVED',4),

(2,3,'2026-02-25','2026-02-25','HALF_PM',0.5,'Family business','REJECTED',4),

(3,1,'2026-03-15','2026-03-16','FULL',2,'Travel','PENDING',NULL);



-- =====================================
-- INSERT LEAVE LOGS
-- =====================================

INSERT INTO leave_request_logs
(leave_request_id,action,action_by,comment)
VALUES
(1,'CREATED',1,'Leave created'),
(1,'APPROVED',4,'Approved by manager'),

(2,'CREATED',1,'Leave created'),
(2,'APPROVED',4,'Get well soon'),

(3,'CREATED',2,'Leave created'),
(3,'REJECTED',4,'Not enough team coverage');