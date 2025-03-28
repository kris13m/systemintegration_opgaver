DROP DATABASE IF EXISTS bank_db;
CREATE DATABASE bank_db;
USE bank_db;

DROP USER IF EXISTS 'John'@'localhost';
DROP USER IF EXISTS 'Bill'@'localhost';
DROP USER IF EXISTS 'Howard'@'localhost';
DROP ROLE IF EXISTS employee_role;
DROP ROLE IF EXISTS admin_role;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    department VARCHAR(50),
    salary DECIMAL(10,2) NOT NULL,
    user_id VARCHAR(100), -- Links to MySQL user
    employeeStatus VARCHAR(50)
);

-- Step 4: Insert Employees
INSERT INTO employees (name, email, department, salary, user_id)
VALUES
    ('John', 'john@bank.com', 'Admin', 90000.00, 'John@localhost'),
    ('Bill', 'bill@bank.com', 'Finance', 50000.00, 'Bill@localhost'),
    ('Howard', 'howard@bank.com', 'Finance', 55000.00, 'Howard@localhost');

-- Step 5: Create Users
CREATE USER 'John'@'localhost' IDENTIFIED BY 'adminPass';
CREATE USER 'Bill'@'localhost' IDENTIFIED BY 'workerPass';
CREATE USER 'Howard'@'localhost' IDENTIFIED BY 'workerPass';

CREATE ROLE employee_role;
CREATE ROLE admin_role;

CREATE VIEW employee_view AS
SELECT name, email, department, salary, employeeStatus
FROM employees
WHERE user_id = SESSION_USER();

DELIMITER //
	CREATE PROCEDURE employee_update(IN new_status VARCHAR(50))
	BEGIN
		UPDATE employees 
		SET status = new_status
		WHERE user_id = SESSION_USER();
	END //
DELIMITER ;


GRANT ALL PRIVILEGES ON bank_db.* TO admin_role;

GRANT SELECT ON bank_db.employee_view TO employee_role;
GRANT EXECUTE ON PROCEDURE bank_db.employee_update TO employee_role;


GRANT employee_role TO 'Bill'@'localhost', 'Howard'@'localhost';
GRANT admin_role TO 'John'@'localhost';