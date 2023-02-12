-- Inserts names of departments into department table
INSERT INTO department
  (name)
VALUES
  ('Kitchen'),
  ('Human Resources'),
  ('Management'),
  ('accounting');

-- Inserts roles of employee into role table
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Chef', 65000, 1),
  ('HR Manager', 85000, 2),
  ('Food Service Manager', 55000, 3),
  ('Accountant', 200000, 4);

--  Inserts employee information into employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('James', 'Corbin', 1, 4),
  ('Beyonce', 'Knowles', 2, 3),
  ('Aubrey', 'Graham', 3, 1),
  ('Gwen', 'Stefani', 4, 5);