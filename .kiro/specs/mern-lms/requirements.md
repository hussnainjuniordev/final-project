# Requirements Document

## Introduction

This document defines the functional and non-functional requirements for the MERN Stack Learning Management System (LMS). The system supports three user roles — Admin, Instructor, and Student — each with distinct capabilities. It provides JWT-based authentication, course and lesson management with Cloudinary-hosted video uploads, student enrollment tracking, and role-based access control, all delivered through a RESTful Express API consumed by a React + Bootstrap frontend.

Requirements are derived from the approved design document and cover the complete feature set to be built on top of the existing starter structure (`LMSBackend/` and `LearningManagementSystem/`).

---

## Glossary

- **System**: The complete MERN LMS application (backend API + React frontend).
- **API**: The Express.js RESTful backend running in `LMSBackend/`.
- **Frontend**: The React + Vite SPA running in `LearningManagementSystem/`.
- **Auth_Controller**: The Express controller handling user registration and login (`src/controller/authController.js`).
- **Course_Controller**: The Express controller handling course CRUD operations (`src/controller/courseController.js`).
- **Lesson_Controller**: The Express controller handling lesson creation and retrieval (`src/controller/lessonController.js`).
- **Enrollment_Controller**: The Express controller handling student enrollment and progress (`src/controller/enrollmentController.js`).
- **User_Controller**: The Express controller handling admin user management and profile access (`src/controller/userController.js`).
- **verifyToken**: The Express middleware that validates JWT tokens on protected routes (`src/middleware/authMiddleware.js`).
- **requireRole**: The Express middleware that enforces role-based access control (`src/middleware/roleMiddleware.js`).
- **Upload_Middleware**: The multer + multer-storage-cloudinary middleware that streams video uploads to Cloudinary (`src/middleware/uploadMiddleware.js`).
- **AuthContext**: The React context provider that manages global authentication state (`src/context/AuthContext.jsx`).
- **ProtectedRoute**: The React component that guards routes requiring authentication or a specific role (`src/routes/ProtectedRoute.jsx`).
- **Navbar**: The navigation bar rendered in `src/layouts/MainLayout.jsx`.
- **CourseCard**: The reusable React component for displaying a course in listings (`src/components/CourseCard.jsx`).
- **VideoPlayer**: The React component that renders a Cloudinary-hosted video (`src/components/VideoPlayer.jsx`).
- **User**: A registered account with role `admin`, `instructor`, or `student`.
- **Course**: A learning resource created by an Instructor, containing metadata and associated Lessons.
- **Lesson**: A single video-based learning unit belonging to a Course.
- **Enrollment**: A record linking a Student to a Course, tracking progress as a percentage.
- **JWT**: JSON Web Token used for stateless authentication, signed with `JWT_SECRET`, valid for 7 days.
- **Cloudinary**: The third-party CDN used to store and serve lesson video files.
- **Admin**: A User with role `admin` who can manage all users, courses, and view analytics.
- **Instructor**: A User with role `instructor` who can create and manage their own courses and lessons.
- **Student**: A User with role `student` who can browse courses, enroll, and view lessons.

---

## Requirements

### Requirement 1: User Registration and Authentication

**User Story:** As a visitor, I want to register an account and log in, so that I can access role-appropriate features of the LMS.

#### Acceptance Criteria

1. WHEN a registration request is received with valid `name`, `email`, `password`, and `role` fields, THE Auth_Controller SHALL create a new User, hash the password with bcrypt (saltRounds = 10), and return a 201 response containing a signed JWT and the user object (excluding the password field).
2. WHEN a registration request is received with an email that already exists in the database, THE Auth_Controller SHALL return a 409 response with the message `"Email already in use"`.
3. WHEN a registration request is received with a password shorter than 6 characters, THE Auth_Controller SHALL return a 400 response with a descriptive validation error.
4. THE Auth_Controller SHALL never include the `password` field in any response body.
5. WHEN a login request is received with a valid email and matching password, THE Auth_Controller SHALL return a 200 response containing a signed JWT and the user object (excluding the password field).
6. WHEN a login request is received with an email that does not exist or a password that does not match, THE Auth_Controller SHALL return a 401 response with the message `"Invalid credentials"`.
7. THE Auth_Controller SHALL sign all JWTs using `process.env.JWT_SECRET` with an expiry of 7 days.

---

### Requirement 2: Course Management

**User Story:** As an instructor, I want to create, update, and delete my courses, so that I can offer learning content to students.

#### Acceptance Criteria

1. THE Course_Controller SHALL allow unauthenticated requests to retrieve all courses via `GET /api/courses` and a single course via `GET /api/courses/:id`.
2. WHEN a course list request includes a `?category=` query parameter, THE Course_Controller SHALL return only courses matching that category.
3. WHEN a course list request includes a `?search=` query parameter, THE Course_Controller SHALL return only courses whose title or description contains the search term (case-insensitive).
4. WHEN an authenticated Instructor submits a valid course creation request, THE Course_Controller SHALL persist the course with the requesting user as the `instructor` field and return a 201 response with the created course.
5. WHEN an authenticated Instructor submits an update request for a course they own, THE Course_Controller SHALL apply the changes and return the updated course.
6. WHEN an authenticated Instructor submits an update or delete request for a course they do not own, THE Course_Controller SHALL return a 403 response.
7. WHEN an authenticated Admin submits an update or delete request for any course, THE Course_Controller SHALL allow the operation.
8. THE Course_Controller SHALL populate the `instructor` field with the instructor's `name` on all course read responses.

---

### Requirement 3: Lesson Management and Video Upload

**User Story:** As an instructor, I want to upload video lessons to my courses, so that students can access learning content.

#### Acceptance Criteria

1. WHEN an authenticated Instructor submits a lesson creation request with a valid video file and course ID, THE Lesson_Controller SHALL verify the instructor owns the course, stream the video to Cloudinary via the Upload_Middleware, persist the lesson with the returned `secure_url`, and return a 201 response with the created lesson.
2. WHEN an authenticated Instructor submits a lesson creation request for a course they do not own, THE Lesson_Controller SHALL return a 403 response.
3. WHEN a request is made to retrieve lessons for a course by an authenticated Student, Instructor, or Admin, THE Lesson_Controller SHALL return all lessons for that course ordered by `createdAt` ascending.
4. THE Upload_Middleware SHALL accept only video files with MIME types `mp4`, `mov`, `avi`, or `mkv`.
5. THE Upload_Middleware SHALL reject video files exceeding 200 MB and return an appropriate error response.
6. IF the Cloudinary upload fails, THEN THE Lesson_Controller SHALL return a 500 response with the message `"Video upload failed"`.

---

### Requirement 4: Student Enrollment and Progress

**User Story:** As a student, I want to enroll in courses and track my progress, so that I can manage my learning journey.

#### Acceptance Criteria

1. WHEN an authenticated Student submits an enrollment request for a course they are not already enrolled in, THE Enrollment_Controller SHALL create an Enrollment record with `progress` initialised to 0 and return a 201 response.
2. WHEN an authenticated Student submits an enrollment request for a course they are already enrolled in, THE Enrollment_Controller SHALL return a 409 response with the message `"Already enrolled"`.
3. WHEN an authenticated Student requests their enrolled courses via `GET /api/my-courses`, THE Enrollment_Controller SHALL return all courses the student is enrolled in, populated with course details.
4. THE Enrollment Model SHALL enforce that the `progress` field is a number between 0 and 100 inclusive.
5. THE Enrollment Model SHALL enforce a compound unique index on `{ student, course }` to prevent duplicate enrollment records at the database level.

---

### Requirement 5: Authentication and Role Middleware

**User Story:** As a system operator, I want all protected routes to enforce authentication and role-based access, so that users can only perform actions permitted by their role.

#### Acceptance Criteria

1. WHEN a request to a protected route includes a valid `Authorization: Bearer <token>` header, THE verifyToken middleware SHALL decode the token and attach `{ id, role }` to `req.user`, then call `next()`.
2. WHEN a request to a protected route is missing the `Authorization` header, contains a malformed token, or contains an expired token, THE verifyToken middleware SHALL return a 401 response with the message `"Unauthorized"`.
3. WHEN a request reaches a role-restricted route and `req.user.role` is in the allowed roles list, THE requireRole middleware SHALL call `next()`.
4. WHEN a request reaches a role-restricted route and `req.user.role` is not in the allowed roles list, THE requireRole middleware SHALL return a 403 response with the message `"Forbidden"`.

---

### Requirement 6: Frontend Authentication State Management

**User Story:** As a user, I want my login session to persist across page refreshes and for the app to show me only the navigation and pages relevant to my role, so that I have a seamless and secure experience.

#### Acceptance Criteria

1. WHEN a user successfully logs in, THE AuthContext SHALL store the JWT and user object in `localStorage` and expose them via the `useAuth` hook.
2. WHEN a user logs out, THE AuthContext SHALL remove the JWT and user object from `localStorage` and reset the authentication state.
3. WHEN the application loads, THE AuthContext SHALL read any existing token and user from `localStorage` to restore the session.
4. WHEN an unauthenticated user navigates to a protected route, THE ProtectedRoute SHALL redirect the user to `/login`.
5. WHEN an authenticated user navigates to a route restricted to a role they do not hold, THE ProtectedRoute SHALL redirect the user to `/`.
6. WHILE the user is unauthenticated, THE Navbar SHALL display links for Home, Courses, Login, and Register.
7. WHILE the user is authenticated as a Student, THE Navbar SHALL display links for Home, Courses, My Courses, Profile, and Logout.
8. WHILE the user is authenticated as an Instructor, THE Navbar SHALL display links for Home, My Courses (dashboard), and Logout.
9. WHILE the user is authenticated as an Admin, THE Navbar SHALL display links for Dashboard and Logout.

---

### Requirement 7: Course and Video Display Components

**User Story:** As a student, I want to browse courses and watch lesson videos in a clear, consistent interface, so that I can easily find and consume learning content.

#### Acceptance Criteria

1. THE CourseCard component SHALL display the course `title`, `description`, `category`, `price`, and instructor `name` for any course object passed to it.
2. THE CourseCard component SHALL render a link to `/courses/:id` for the displayed course.
3. WHEN a Student views a course they are not enrolled in, THE CourseCard component SHALL display an Enroll button.
4. THE VideoPlayer component SHALL render an HTML5 `<video>` element with the `src` attribute set to the provided Cloudinary URL and the `title` attribute set to the provided title.

---

### Requirement 8: Admin User and Analytics Management

**User Story:** As an admin, I want to manage all users and view enrollment analytics, so that I can maintain the platform and monitor its usage.

#### Acceptance Criteria

1. WHEN an authenticated Admin requests all users via `GET /api/users`, THE User_Controller SHALL return a list of all User records (excluding password fields).
2. WHEN an authenticated Admin submits a delete request for a user via `DELETE /api/users/:id`, THE User_Controller SHALL remove the user from the database and return a success message.
3. WHEN an authenticated Admin requests analytics via `GET /api/analytics`, THE Enrollment_Controller SHALL return aggregated enrollment data including total enrollments per course.
4. WHEN any authenticated user requests their own profile via `GET /api/users/profile`, THE User_Controller SHALL return the user's own record (excluding the password field).

---

### Requirement 9: API Error Handling and Security

**User Story:** As a developer, I want the API to return consistent, descriptive error responses and enforce security best practices, so that clients can handle errors gracefully and the system remains secure.

#### Acceptance Criteria

1. WHEN a request references a course or user ID that does not exist in the database, THE System SHALL return a 404 response with a descriptive message (e.g., `"Course not found"`).
2. THE API SHALL configure CORS to allow requests only from the origin specified in `process.env.CLIENT_URL`.
3. WHEN the frontend `api.js` interceptor receives a 401 response, THE Frontend SHALL clear `localStorage` and redirect the user to `/login`.
4. THE System SHALL store all secrets (`JWT_SECRET`, `CLOUDINARY_*`, `MONGO_URI`) exclusively in environment variables and never include them in API responses or logs.

---

### Requirement 10: Database Schema and Indexing

**User Story:** As a developer, I want well-defined Mongoose schemas with appropriate indexes, so that the database is consistent, performant, and enforces data integrity.

#### Acceptance Criteria

1. THE User Model SHALL enforce a unique index on the `email` field and store passwords as bcrypt hashes.
2. THE Course Model SHALL require `title`, `description`, `instructor` (ObjectId ref to User), and `category` fields, and enforce `price` ≥ 0.
3. THE Lesson Model SHALL require `title`, `videoUrl` (Cloudinary `secure_url`), and `courseId` (ObjectId ref to Course) fields.
4. THE Enrollment Model SHALL require `student` (ObjectId ref to User) and `course` (ObjectId ref to Course) fields, enforce a compound unique index on `{ student, course }`, and constrain `progress` to the range [0, 100].
5. THE System SHALL create a MongoDB index on `Course.instructor` and `Lesson.courseId` to support efficient query performance.
