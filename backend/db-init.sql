
-- Create database
CREATE DATABASE IF NOT EXISTS sikaunemitra;
USE sikaunemitra;

-- Create table for admins without ENUM, and setting role to 'admin' by default
CREATE TABLE IF NOT EXISTS admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL DEFAULT 'admin', -- role is fixed as 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tables for users, student profiles, courses, purchases, referrals, offers, and user offers
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM( 'teacher', 'student') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  school_name VARCHAR(255),
  class VARCHAR(100),
  profile_picture VARCHAR(255),
  guardian_name VARCHAR(255),
  guardian_contact VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  referral_code VARCHAR(20) UNIQUE,
  referred_by_user_id INT,
  referred_by_role ENUM('student', 'teacher', 'admin') DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referred_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create table for teacher profiles with nullable referral fields
CREATE TABLE IF NOT EXISTS teacher_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL, -- Foreign key referencing users table
  phone VARCHAR(15),
  address TEXT,
  school_name VARCHAR(255),
  subjects TEXT, -- Stores multiple subjects the teacher teaches
  years_of_experience INT, -- Years of experience in teaching
  qualification VARCHAR(255), -- Teacher's qualifications
    available_time VARCHAR(255), -- Store available hours (e.g., "Mon-Fri, 9 AM - 5 PM")
   profile_picture_url VARCHAR(255), -- URL to the teacher's profile picture
  referral_code VARCHAR(50) DEFAULT NULL, -- Unique referral code for teacher (nullable)
  referred_by_user_id INT DEFAULT NULL, -- ID of the user who referred this teacher (nullable)
  referred_by_role ENUM('teacher', 'student', 'admin') DEFAULT 'admin', -- Role of the referrer (nullable with default as 'admin')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Linking to the users table
  FOREIGN KEY (referred_by_user_id) REFERENCES users(id) ON DELETE SET NULL -- Linking to the users table for referrer
);

-- Create table for courses with availability status
CREATE TABLE IF NOT EXISTS courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  category VARCHAR(100),
  duration VARCHAR(50),
  level VARCHAR(50),
  image_url VARCHAR(255),
  status ENUM('available', 'not available', 'coming soon') DEFAULT 'coming soon',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);


-- Create table for course materials (files like PDF, presentations)
CREATE TABLE IF NOT EXISTS course_materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_type ENUM('pdf', 'presentation') NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,  -- Price for paid material
  is_paid BOOLEAN DEFAULT FALSE,  -- Whether the material is paid or free
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create table to store reviews written by students for teachers
CREATE TABLE IF NOT EXISTS teacher_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each review
  teacher_id INT NOT NULL, -- Foreign key to teacher_profiles table
  student_id INT NOT NULL, -- Foreign key to users table (student role)
  rating INT CHECK (rating BETWEEN 1 AND 5), -- Rating from 1 to 5
  review_text TEXT, -- Textual feedback
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the review was posted

  FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Create table to store reviews written by teachers for students
CREATE TABLE IF NOT EXISTS student_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id INT NOT NULL,
  student_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE 
);

-- Create table to store purchases made by students
CREATE TABLE IF NOT EXISTS purchases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE    
);

-- Create table to store blogs
CREATE TABLE IF NOT EXISTS blogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  featured_image VARCHAR(255),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  author_id INT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create table to store comments/reviews on blog posts
CREATE TABLE IF NOT EXISTS blog_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  blog_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Table to store detailed experience history of teachers
CREATE TABLE IF NOT EXISTS teacher_experiences (
  id INT PRIMARY KEY AUTO_INCREMENT,            -- Unique ID for each experience
  teacher_profile_id INT NOT NULL,              -- Links to teacher_profiles table
  institution_name VARCHAR(255) NOT NULL,       -- Name of the institution
  position VARCHAR(100),                        -- Position or role held
  start_date DATE,                              -- When the job started
  end_date DATE,                                -- When it ended (NULL if ongoing)
  description TEXT,                             -- Extra info (optional)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (teacher_profile_id) REFERENCES teacher_profiles(id) ON DELETE CASCADE
);
-- Table to store educational qualifications of teachers
CREATE TABLE IF NOT EXISTS teacher_qualifications (
  id INT PRIMARY KEY AUTO_INCREMENT,            -- Unique ID for each qualification
  teacher_profile_id INT NOT NULL,              -- Links to teacher_profiles table
  degree_name VARCHAR(255) NOT NULL,            -- Name of the degree
  institution_name VARCHAR(255) NOT NULL,       -- Name of the institution
  graduation_year INT,                          -- Year of graduation
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_profile_id) REFERENCES teacher_profiles(id) ON DELETE CASCADE    
);
-- Table to manage flexible pricing per teacher
CREATE TABLE IF NOT EXISTS teacher_pricing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_profile_id INT NOT NULL,            -- Link to teacher_profiles
  title VARCHAR(100),                         -- e.g., "1 Hour Session", "Group Class", "Math Tutoring"
  description TEXT,                           -- Optional detail
  price DECIMAL(10, 2) NOT NULL,              -- Price in currency
  duration_minutes INT DEFAULT 60,            -- Duration in minutes (optional)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (teacher_profile_id) REFERENCES teacher_profiles(id) ON DELETE CASCADE
);
-- Table to manage flexible pricing per course
CREATE TABLE IF NOT EXISTS course_pricing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,                     -- Link to courses
  title VARCHAR(100),                         -- e.g., "1 Hour Session", "Group Class", "Math Tutoring"
  description TEXT,                           -- Optional detail              
  price DECIMAL(10, 2) NOT NULL,              -- Price in currency    
  duration_minutes INT DEFAULT 60,            -- Duration in minutes (optional)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE  
);
CREATE TABLE IF NOT EXISTS notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  category VARCHAR(100),
  grade VARCHAR(50),
  subject VARCHAR(100),
  price DECIMAL(10, 2) DEFAULT 0,
  file_url VARCHAR(255),
  file_type VARCHAR(20),
  pinned BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS referral_points (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  points INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS offers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  description TEXT,
  discount_percent INT,
  valid_from DATE,
  valid_until DATE,
  status ENUM('active', 'expired') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_offers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  offer_id INT NOT NULL,
  redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS referrals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  referrer_id INT NOT NULL,
  referred_user_id INT NOT NULL,
  referred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reward_earned BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(referrer_id, referred_user_id)
);

-- Create table for note topics
CREATE TABLE IF NOT EXISTS note_topics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  note_id INT NOT NULL,
  topic VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- Create a table to store reviews for notes
CREATE TABLE IF NOT EXISTS note_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,                  -- Unique identifier for each review
  note_id INT NOT NULL,                               -- Foreign key referencing the reviewed note
  user_id INT NOT NULL,                               -- Foreign key referencing the student who gave the review
  rating INT CHECK (rating BETWEEN 1 AND 5),          -- Rating out of 5
  comment TEXT,                                       -- Optional text review/comment
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- Timestamp of when the review was created

  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,  -- Cascade delete if the note is deleted
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE   -- Cascade delete if the user is deleted
);

-- Insert dummy data for the sikaunemitra database

-- Admin records
INSERT INTO admin (name, email, password, role) VALUES
('Admin User', 'admin@sikaunemitra.com', 'hashed_password_123', 'admin'),
('John Doe', 'john.admin@sikaunemitra.com', 'hashed_password_456', 'admin'),
('Sarah Johnson', 'sarah.admin@sikaunemitra.com', 'hashed_password_789', 'admin'),
('Michael Brown', 'michael.admin@sikaunemitra.com', 'hashed_password_012', 'admin'),
('Jessica Lee', 'jessica.admin@sikaunemitra.com', 'hashed_password_345', 'admin');

-- Users records (both teachers and students)
INSERT INTO users (name, email, password, role) VALUES
('Jane Smith', 'jane.smith@example.com', 'hashed_password_111', 'student'),
('Robert Johnson', 'robert.johnson@example.com', 'hashed_password_222', 'student'),
('Emily Davis', 'emily.davis@example.com', 'hashed_password_333', 'student'),
('Sam Wilson', 'sam.wilson@example.com', 'hashed_password_444', 'student'),
('Lisa Chen', 'lisa.chen@example.com', 'hashed_password_555', 'student'),
('David Miller', 'david.miller@example.com', 'hashed_password_666', 'teacher'),
('Emma White', 'emma.white@example.com', 'hashed_password_777', 'teacher'),
('Mark Taylor', 'mark.taylor@example.com', 'hashed_password_888', 'teacher'),
('Olivia Brown', 'olivia.brown@example.com', 'hashed_password_999', 'teacher'),
('James Garcia', 'james.garcia@example.com', 'hashed_password_000', 'teacher');

-- Student profiles
INSERT INTO student_profiles (user_id, phone, address, school_name, class, profile_picture, guardian_name, guardian_contact, date_of_birth, gender, referral_code) VALUES
(1, '1234567890', '123 Main St, City', 'Springfield High School', '10th Grade', 'profile1.jpg', 'Mary Smith', '9876543210', '2006-05-15', 'female', 'JANE123'),
(2, '2345678901', '456 Oak St, Town', 'Central High School', '9th Grade', 'profile2.jpg', 'Tom Johnson', '8765432109', '2007-03-22', 'male', 'ROBERT456'),
(3, '3456789012', '789 Elm St, Village', 'Westside Academy', '11th Grade', 'profile3.jpg', 'Sarah Davis', '7654321098', '2005-11-10', 'female', 'EMILY789'),
(4, '4567890123', '321 Pine St, County', 'Northern High School', '12th Grade', 'profile4.jpg', 'John Wilson', '6543210987', '2004-08-17', 'male', 'SAM012'),
(5, '5678901234', '654 Cedar St, District', 'Eastern Secondary School', '10th Grade', 'profile5.jpg', 'Helen Chen', '5432109876', '2006-01-30', 'female', 'LISA345');

-- Teacher profiles
INSERT INTO teacher_profiles (user_id, phone, address, school_name, subjects, years_of_experience, qualification, available_time, profile_picture_url, referral_code) VALUES
(6, '6789012345', '987 Oak St, City', 'Springfield High School', 'Mathematics, Physics', 8, 'M.Sc. Mathematics', 'Mon-Fri, 2 PM - 8 PM', 'teacher1.jpg', 'DAVID123'),
(7, '7890123456', '654 Pine St, Town', 'Central University', 'English Literature, History', 5, 'M.A. Literature', 'Mon-Wed-Fri, 10 AM - 6 PM', 'teacher2.jpg', 'EMMA456'),
(8, '8901234567', '321 Elm St, Village', 'Science Academy', 'Chemistry, Biology', 10, 'Ph.D. Chemistry', 'Tue-Thu-Sat, 9 AM - 5 PM', 'teacher3.jpg', 'MARK789'),
(9, '9012345678', '159 Cedar St, County', 'Arts College', 'Art, Design', 6, 'B.F.A. Fine Arts', 'Wed-Fri-Sun, 11 AM - 7 PM', 'teacher4.jpg', 'OLIVIA012'),
(10, '0123456789', '753 Maple St, District', 'Tech Institute', 'Computer Science, Programming', 7, 'M.Tech Computer Science', 'Mon-Thu-Sat, 1 PM - 9 PM', 'teacher5.jpg', 'JAMES345');

-- Courses
INSERT INTO courses (title, description, price, category, duration, level, image_url, status, created_by) VALUES
('Introduction to Algebra', 'Learn the basics of algebraic equations and functions', 29.99, 'Mathematics', '4 weeks', 'Beginner', 'algebra.jpg', 'available', 6),
('Advanced English Composition', 'Master the art of essay writing and creative expression', 39.99, 'English', '8 weeks', 'Advanced', 'english.jpg', 'available', 7),
('Chemistry Fundamentals', 'Explore the basic principles of chemistry and chemical reactions', 49.99, 'Science', '6 weeks', 'Intermediate', 'chemistry.jpg', 'available', 8),
('Digital Art Basics', 'Introduction to digital art tools and techniques', 34.99, 'Arts', '5 weeks', 'Beginner', 'art.jpg', 'coming soon', 9),
('Python Programming', 'Learn Python programming from scratch to advanced concepts', 59.99, 'Computer Science', '10 weeks', 'All Levels', 'python.jpg', 'available', 10);

-- Course materials
INSERT INTO course_materials (course_id, title, file_type, file_url, price, is_paid) VALUES
(1, 'Algebra Formulas Reference', 'pdf', 'algebra_formulas.pdf', 0, FALSE),
(1, 'Practice Problems Set 1', 'pdf', 'algebra_problems.pdf', 9.99, TRUE),
(2, 'Essay Writing Guide', 'presentation', 'essay_guide.pptx', 0, FALSE),
(3, 'Periodic Table Explanation', 'pdf', 'periodic_table.pdf', 12.99, TRUE),
(5, 'Python Basics Slides', 'presentation', 'python_basics.pptx', 14.99, TRUE);

-- Teacher reviews
INSERT INTO teacher_reviews (teacher_id, student_id, rating, review_text) VALUES
(1, 1, 5, 'Excellent teacher! Very clear explanations of complex math concepts.'),
(2, 2, 4, 'Great at teaching literature. Made classic novels interesting.'),
(3, 3, 5, 'Knowledgeable about chemistry and makes learning fun.'),
(4, 4, 3, 'Good art teacher, but could provide more detailed feedback.'),
(5, 5, 4, 'Very helpful in explaining programming concepts to beginners.');

-- Student reviews
INSERT INTO student_reviews (teacher_id, student_id, rating, review_text) VALUES
(1, 1, 4, 'Dedicated student who works hard to understand concepts.'),
(2, 2, 5, 'Excellent writing skills and great class participation.'),
(3, 3, 4, 'Shows genuine interest in chemistry and asks thoughtful questions.'),
(4, 4, 3, 'Has artistic potential but needs more practice with techniques.'),
(5, 5, 5, 'Quick learner with strong analytical skills for programming.');

-- Purchases
INSERT INTO purchases (user_id, course_id, payment_method, payment_status) VALUES
(1, 1, 'Credit Card', 'completed'),
(2, 2, 'PayPal', 'completed'),
(3, 3, 'Bank Transfer', 'pending'),
(4, 4, 'Credit Card', 'failed'),
(5, 5, 'PayPal', 'completed');

-- Blogs
INSERT INTO blogs (title, content, created_by) VALUES
('Tips for Effective Studying', 'Here are some strategies to improve your study habits...', 6),
('The Importance of STEM Education', 'STEM fields are increasingly important in today''s economy...', 7),
('How to Prepare for College Admissions', 'College applications require careful planning...', 8),
('Benefits of Extracurricular Activities', 'Engaging in activities outside the classroom can enhance...', 9),
('Digital Literacy in Modern Education', 'In today''s digital world, students need to develop...', 10);

-- Blog comments
INSERT INTO blog_comments (blog_id, user_id, comment) VALUES
(1, 1, 'These study tips really helped me improve my grades!'),
(1, 2, 'I especially liked the suggestion about creating a study schedule.'),
(2, 3, 'Great article about STEM! I''m now considering a science major.'),
(3, 4, 'The college application advice was very timely for me.'),
(4, 5, 'I agree that extracurricular activities are important for personal growth.');

-- Teacher experiences
INSERT INTO teacher_experiences (teacher_profile_id, institution_name, position, start_date, end_date, description) VALUES
(1, 'Springfield High School', 'Math Teacher', '2015-08-01', NULL, 'Teaching algebra and calculus to grades 10-12'),
(2, 'Central University', 'Teaching Assistant', '2016-09-01', '2018-05-31', 'Assisted in undergraduate literature courses'),
(2, 'Town Library', 'Literature Workshop Leader', '2018-06-01', NULL, 'Conducting creative writing workshops'),
(3, 'Science Academy', 'Chemistry Professor', '2012-07-01', NULL, 'Teaching undergraduate and graduate chemistry courses'),
(5, 'Tech Solutions Inc.', 'Software Developer', '2014-01-15', '2017-06-30', 'Worked as a Python developer before teaching');

-- Teacher qualifications
INSERT INTO teacher_qualifications (teacher_profile_id, degree_name, institution_name, graduation_year) VALUES
(1, 'Bachelor of Science in Mathematics', 'State University', 2010),
(1, 'Master of Science in Mathematics', 'National University', 2013),
(2, 'Bachelor of Arts in English', 'Liberal Arts College', 2012),
(2, 'Master of Arts in Literature', 'Central University', 2015),
(3, 'Doctor of Philosophy in Chemistry', 'Science University', 2011);

-- Teacher pricing
INSERT INTO teacher_pricing (teacher_profile_id, title, description, price, duration_minutes) VALUES
(1, 'One-on-One Algebra Tutoring', 'Personalized algebra lessons', 35.00, 60),
(2, 'Essay Review Session', 'Detailed feedback on essays', 30.00, 45),
(3, 'Chemistry Lab Preparation', 'Help with understanding lab experiments', 40.00, 90),
(4, 'Art Portfolio Review', 'Assessment and guidance for art portfolios', 25.00, 30),
(5, 'Coding Problem Solving', 'Help with programming challenges', 45.00, 60);

-- Course pricing
INSERT INTO course_pricing (course_id, title, description, price, duration_minutes) VALUES
(1, 'Algebra Fast Track', 'Accelerated algebra course', 49.99, 120),
(1, 'Algebra Group Session', 'Learn with peers', 19.99, 90),
(2, 'English Composition Intensive', 'Deep dive into writing techniques', 59.99, 180),
(3, 'Chemistry Concepts Explained', 'Clear explanations of fundamental concepts', 39.99, 60),
(5, 'Python Weekend Bootcamp', 'Intensive programming training', 99.99, 480);

-- Notes
INSERT INTO notes (title, content, category, grade, subject, price, file_url, file_type, created_by) VALUES
('Algebra Formula Cheat Sheet', 'A comprehensive list of algebraic formulas...', 'Mathematics', '10th Grade', 'Algebra', 5.99, 'algebra_notes.pdf', 'pdf', 6),
('Shakespeare Analysis', 'Analysis of major themes in Shakespeare''s plays...', 'Literature', '11th Grade', 'English', 4.99, 'shakespeare_notes.pdf', 'pdf', 7),
('Chemical Reactions Guide', 'Understanding different types of chemical reactions...', 'Science', '9th Grade', 'Chemistry', 6.99, 'chemistry_notes.pdf', 'pdf', 8),
('Color Theory Basics', 'Introduction to color wheels and color relationships...', 'Arts', '12th Grade', 'Art', 3.99, 'color_theory.pdf', 'pdf', 9),
('Python Functions Reference', 'Common Python functions with examples...', 'Computer Science', 'College', 'Programming', 7.99, 'python_functions.pdf', 'pdf', 10);

-- Note topics
INSERT INTO note_topics (note_id, topic) VALUES
(1, 'Quadratic Equations'),
(1, 'Linear Equations'),
(2, 'Hamlet'),
(2, 'Macbeth'),
(3, 'Redox Reactions'),
(3, 'Acid-Base Reactions'),
(4, 'Complementary Colors'),
(4, 'Color Mixing'),
(5, 'List Comprehensions'),
(5, 'Lambda Functions');

-- Note reviews
INSERT INTO note_reviews (note_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Very helpful for exam preparation!'),
(2, 2, 4, 'Great insights into Shakespeare\'s works.'),
(3, 3, 5, 'Explained chemical reactions clearly.'),
(4, 4, 3, 'Good basic information but could include more examples.'),
(5, 5, 4, 'Useful reference for Python programming.');

-- Referral points
INSERT INTO referral_points (user_id, points) VALUES
(1, 100),
(2, 75),
(3, 150),
(4, 50),
(5, 125);

-- Offers
INSERT INTO offers (title, description, discount_percent, valid_from, valid_until, status) VALUES
('Back to School Special', 'Get 20% off all courses for the new school year', 20, '2025-01-15', '2025-05-15', 'active'),
('Summer Learning Discount', 'Enroll in summer courses with 15% discount', 15, '2024-06-01', '2024-08-31', 'expired'),
('Teacher Appreciation', '25% off for teachers on all courses', 25, '2025-03-01', '2025-04-30', 'active'),
('First-Time Student Offer', '10% off your first course purchase', 10, '2025-01-01', '2025-12-31', 'active'),
('Holiday Special', 'End of year discounts on all learning materials', 30, '2024-12-01', '2024-12-31', 'expired');

-- User offers
INSERT INTO user_offers (user_id, offer_id, redeemed) VALUES
(1, 1, FALSE),
(2, 1, TRUE),
(3, 3, FALSE),
(4, 4, TRUE),
(5, 5, FALSE);

-- Referrals (ensuring they follow the constraints)
INSERT INTO referrals (referrer_id, referred_user_id, reward_earned) VALUES
(1, 3, TRUE),
(2, 4, FALSE),
(6, 1, TRUE),
(7, 2, TRUE),
(8, 5, FALSE);