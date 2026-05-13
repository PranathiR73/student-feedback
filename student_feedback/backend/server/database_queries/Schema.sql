-- ====================================================================================================
-- STUDENT_FEEDBACK DATABASE
-- ====================================================================================================
CREATE DATABASE STUDENT_FEEDBACK;
USE STUDENT_FEEDBACK;
-- ====================================================================================================

-- ====================================================================================================
-- Students Table
-- Stores student details who can give feedback
-- ====================================================================================================
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each student
    name VARCHAR(100) NOT NULL,   			   -- Full name of the student
    email VARCHAR(100) NOT NULL UNIQUE,        -- Unique email for login/communication
    password_hash VARCHAR(255) NOT NULL,       -- Securely stored password (hashed)
    department VARCHAR(100),                   -- Department student belongs to (e.g., CSE, ECE)
    batch_year INT                             -- Year of enrollment (e.g., 2022)
);
-- ====================================================================================================


-- ====================================================================================================
-- Faculty Table
-- Stores faculty members who teach courses
-- ====================================================================================================
CREATE TABLE faculty (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each faculty member
    name VARCHAR(100) NOT NULL,                -- Full name of the faculty member
    email VARCHAR(100) NOT NULL UNIQUE,        -- Unique email for login/communication
    password_hash VARCHAR(255) NOT NULL,       -- Securely stored password (hashed)
    department VARCHAR(100)                    -- Department the faculty belongs to
);
-- ====================================================================================================


-- ====================================================================================================
-- Courses Table
-- Stores course information linked to faculty
-- ====================================================================================================
CREATE TABLE courses (
    course_id CHAR(6) PRIMARY KEY,                   -- Unique ID for each course
    course_name VARCHAR(100) NOT NULL,                  -- Name of the course (e.g., Data Structures)
    faculty_id INT NOT NULL,                            -- Foreign key: Faculty teaching this course
    semester INT,                                       -- Semester in which course is taught
    course_type ENUM('theory', 'practical') NOT NULL DEFAULT 'theory',  -- Type of course
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
);
-- ====================================================================================================


-- ====================================================================================================
-- Admins Table
-- Stores admin login credentials (e.g., Dean, HoD)
-- ====================================================================================================
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,            -- Unique ID for each admin
    name VARCHAR(100) NOT NULL,                         -- Full name of the admin
    email VARCHAR(100) NOT NULL UNIQUE,                 -- Unique login email
    password_hash VARCHAR(255) NOT NULL                 -- Securely stored password (hashed)
);
-- ====================================================================================================


-- ====================================================================================================
-- Feedback_theory Table
-- ====================================================================================================
CREATE TABLE feedback_theory (
	feedback_id INT AUTO_INCREMENT UNIQUE,
    student_id INT NOT NULL,
    faculty_id INT NOT NULL,
    course_id CHAR(6) NOT NULL,
    semester INT,
    year INT,
    q1 TINYINT, q2 TINYINT, q3 TINYINT, q4 TINYINT, q5 TINYINT,
    q6 TINYINT, q7 TINYINT, q8 TINYINT, q9 TINYINT, q10 TINYINT,
    comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- ====================================================================================================


-- ====================================================================================================
-- Feedback_practical Table
-- ====================================================================================================
CREATE TABLE feedback_practical (
    feedback_id INT AUTO_INCREMENT UNIQUE,
    student_id INT NOT NULL,
    faculty_id INT NOT NULL,
    course_id CHAR(6) NOT NULL,
    semester INT,
    year INT,
    q1 TINYINT, q2 TINYINT, q3 TINYINT, q4 TINYINT, q5 TINYINT,
    comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);
-- ====================================================================================================


-- ====================================================================================================
-- Course Feedback Table
-- ====================================================================================================
CREATE TABLE feedback_course (
    feedback_id INT AUTO_INCREMENT UNIQUE,
    student_id INT NOT NULL,
    course_id CHAR(6) NOT NULL,
    semester INT,
    year INT,
    q1 TINYINT, q2 TINYINT, q3 TINYINT, q4 TINYINT, q5 TINYINT,
    comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);
-- ====================================================================================================