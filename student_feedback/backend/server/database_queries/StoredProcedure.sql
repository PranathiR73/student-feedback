-- stored procedure to calculate average feedback of theory course
DELIMITER $$
CREATE PROCEDURE get_avg_rating_theory(
    IN input_faculty_id INT,
    IN input_course_id CHAR(6)
)
BEGIN
    SELECT
        f.name AS faculty_name,
        c.course_name,
        COUNT(*) AS total_feedbacks,
        ROUND(SUM(q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9 + q10) / (COUNT(*) * 10), 2) AS avg_rating
    FROM
        feedback_theory ft
    JOIN
        faculty f ON ft.faculty_id = f.faculty_id
    JOIN
        courses c ON ft.course_id = c.course_id
    WHERE
        ft.faculty_id = input_faculty_id
        AND ft.course_id = input_course_id
    GROUP BY
        f.name, c.course_name;
END$$
DELIMITER ;
-- ----------------------------------------------------------------------------------------------------


-- stored procedure to calculate average feedback of practical course
DELIMITER $$
CREATE PROCEDURE get_avg_rating_practical(
    IN input_faculty_id INT,
    IN input_course_id CHAR(6)
)
BEGIN
    SELECT
        f.name AS faculty_name,
        c.course_name,
        COUNT(*) AS total_feedbacks,
        ROUND(SUM(q1 + q2 + q3 + q4 + q5) / (COUNT(*) * 5), 2) AS avg_rating
    FROM
        feedback_practical ft
    JOIN
        faculty f ON ft.faculty_id = f.faculty_id
    JOIN
        courses c ON ft.course_id = c.course_id
    WHERE
        ft.faculty_id = input_faculty_id
        AND ft.course_id = input_course_id
    GROUP BY
        f.name, c.course_name;
END$$
DELIMITER ;


CALL get_avg_rating_theory(2, 'CS1101');
CALL get_avg_rating_theory(2, 'CS2104');
CALL get_avg_rating_theory(2, 'CS2201');

CALL get_avg_rating_practical(2, 'CS1171');
CALL get_avg_rating_practical(2, 'CS2173');
CALL get_avg_rating_practical(2, 'CS2271');
-- -------------------------------------------------------------------------------------------------------


-- stored procedure to get theory courses taught by faculty
DELIMITER $$
CREATE PROCEDURE get_theory_courses_by_faculty (
    IN input_faculty_id INT
)
BEGIN
    SELECT 
        course_id, 
        course_name, 
        semester
    FROM 
        courses
    WHERE 
        faculty_id = input_faculty_id
        AND course_type = 'theory';
END $$
DELIMITER ;
-- ----------------------------------------------------------------------------------------------------


-- stored procedure to get practical courses taught by faculty
DELIMITER $$
CREATE PROCEDURE get_practical_courses_by_faculty (
    IN input_faculty_id INT
)
BEGIN
    SELECT 
        course_id, 
        course_name, 
        semester
    FROM 
        courses
    WHERE 
        faculty_id = input_faculty_id
        AND course_type = 'practical';
END $$
DELIMITER ;


CALL get_theory_courses_by_faculty(1);
CALL get_practical_courses_by_faculty(10);
-- ----------------------------------------------------------------------------------------------------


-- stored procedure to get courses of a semester
DELIMITER $$
CREATE PROCEDURE get_courses_by_semester(IN sem INT)
BEGIN
    SELECT 
        c.course_id,
        c.course_name,
        f.name AS faculty_name,
        f.faculty_id,
        c.course_type,
        c.semester
    FROM 
        courses c
    JOIN 
        faculty f ON c.faculty_id = f.faculty_id
    WHERE 
        c.semester = sem;
END $$
DELIMITER ;

CALL get_courses_by_semester(7);