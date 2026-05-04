# Tasks

## Task List

### Phase 1: Backend Foundation

- [x] 1.1 Install missing backend dependencies (multer, cloudinary, multer-storage-cloudinary, cors)
  - Run `npm install multer cloudinary multer-storage-cloudinary cors` in `LMSBackend/`
  - Verify packages appear in `package.json`

- [x] 1.2 Wire up `app.js` with CORS, JSON middleware, and route stubs
  - Add `cors` middleware configured from `process.env.CLIENT_URL`
  - Uncomment / add route mounts for auth, courses, lessons, enroll, users, analytics
  - Keep existing `express.json()` and `express.urlencoded()` middleware

- [x] 1.3 Connect to MongoDB in `server.js`
  - Import `mongoose` and `dotenv`
  - Call `mongoose.connect(process.env.MONGO_URI)` before `app.listen`
  - Log connection success/failure

---

### Phase 2: Mongoose Models

- [x] 2.1 Create User model (`LMSBackend/src/models/User.js`)
  - Fields: `name`, `email` (unique, lowercase), `password`, `role` (enum, default `student`)
  - Enable `timestamps: true`
  - Add unique index on `email`

- [x] 2.2 Create Course model (`LMSBackend/src/models/Course.js`)
  - Fields: `title`, `description`, `instructor` (ObjectId ref User), `category`, `price` (min 0, default 0)
  - Enable `timestamps: true`
  - Add index on `instructor`

- [x] 2.3 Create Lesson model (`LMSBackend/src/models/Lesson.js`)
  - Fields: `title`, `videoUrl`, `courseId` (ObjectId ref Course)
  - Enable `timestamps: true`
  - Add index on `courseId`

- [x] 2.4 Create Enrollment model (`LMSBackend/src/models/Enrollment.js`)
  - Fields: `student` (ObjectId ref User), `course` (ObjectId ref Course), `progress` (min 0, max 100, default 0)
  - Enable `timestamps: true`
  - Add compound unique index on `{ student, course }`

---

### Phase 3: Backend Middleware

- [x] 3.1 Create `verifyToken` middleware (`LMSBackend/src/middleware/authMiddleware.js`)
  - Read `Authorization: Bearer <token>` header
  - Verify with `jwt.verify(token, process.env.JWT_SECRET)`
  - Attach `{ id, role }` to `req.user` on success
  - Return 401 `{ message: "Unauthorized" }` if missing, malformed, or expired

- [x] 3.2 Create `requireRole` middleware (`LMSBackend/src/middleware/roleMiddleware.js`)
  - Export `requireRole(...roles)` factory function
  - Return 403 `{ message: "Forbidden" }` if `req.user.role` not in `roles`
  - Call `next()` if role matches

- [x] 3.3 Create upload middleware (`LMSBackend/src/middleware/uploadMiddleware.js`)
  - Configure Cloudinary SDK with env vars (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
  - Set up `multer-storage-cloudinary` storage targeting folder `lms-videos`
  - Restrict allowed formats to `mp4`, `mov`, `avi`, `mkv`
  - Set max file size to 200 MB
  - Export `upload.single('video')`

---

### Phase 4: Auth Controller and Routes

- [x] 4.1 Create Auth Controller (`LMSBackend/src/controller/authController.js`)
  - `register`: validate fields, check duplicate email (409), enforce password ≥ 6 chars (400), hash with bcrypt (saltRounds=10), create User, sign JWT (7d), return 201 `{ token, user }` (no password)
  - `login`: find user by email (401 if not found), compare password (401 if mismatch), sign JWT, return 200 `{ token, user }` (no password)

- [x] 4.2 Create auth routes (`LMSBackend/src/routes/authRoutes.js`)
  - `POST /api/auth/register` → `authController.register`
  - `POST /api/auth/login` → `authController.login`
  - Mount in `app.js` at `/api/auth`

---

### Phase 5: Course Controller and Routes

- [x] 5.1 Create Course Controller (`LMSBackend/src/controller/courseController.js`)
  - `getAllCourses`: support `?category=` and `?search=` filters; populate `instructor` (name only); return 200
  - `getCourseById`: populate `instructor` (name only); return 404 if not found
  - `createCourse`: require instructor role; set `instructor` to `req.user.id`; return 201
  - `updateCourse`: verify ownership (instructor) or admin; return 403 if not owner; return 404 if not found; return updated course
  - `deleteCourse`: verify ownership (instructor) or admin; return 403 if not owner; return 404 if not found; return success message

- [x] 5.2 Create course routes (`LMSBackend/src/routes/courseRoutes.js`)
  - `GET /api/courses` → public → `courseController.getAllCourses`
  - `GET /api/courses/:id` → public → `courseController.getCourseById`
  - `POST /api/courses` → `verifyToken`, `requireRole('instructor')` → `courseController.createCourse`
  - `PUT /api/courses/:id` → `verifyToken`, `requireRole('instructor','admin')` → `courseController.updateCourse`
  - `DELETE /api/courses/:id` → `verifyToken`, `requireRole('instructor','admin')` → `courseController.deleteCourse`
  - Mount in `app.js` at `/api`

---

### Phase 6: Lesson Controller and Routes

- [x] 6.1 Create Lesson Controller (`LMSBackend/src/controller/lessonController.js`)
  - `createLesson`: verify instructor owns the course (403 if not); use `req.file.path` as `videoUrl`; return 201 with created lesson; return 500 `{ message: "Video upload failed" }` if `req.file` is missing
  - `getLessonsByCourse`: return lessons for `courseId` sorted by `createdAt` ascending; return 404 if course not found

- [x] 6.2 Create lesson routes (`LMSBackend/src/routes/lessonRoutes.js`)
  - `POST /api/lessons` → `verifyToken`, `requireRole('instructor')`, `upload.single('video')` → `lessonController.createLesson`
  - `GET /api/lessons/:courseId` → `verifyToken`, `requireRole('student','instructor','admin')` → `lessonController.getLessonsByCourse`
  - Mount in `app.js` at `/api`

---

### Phase 7: Enrollment Controller and Routes

- [x] 7.1 Create Enrollment Controller (`LMSBackend/src/controller/enrollmentController.js`)
  - `enroll`: check for existing enrollment (409 if found); create Enrollment with `progress: 0`; return 201
  - `getMyCourses`: find enrollments by `req.user.id`, populate `course`; return 200 with course list
  - `getAnalytics`: aggregate total enrollments per course; return 200 with analytics data

- [x] 7.2 Create enrollment routes (`LMSBackend/src/routes/enrollmentRoutes.js`)
  - `POST /api/enroll` → `verifyToken`, `requireRole('student')` → `enrollmentController.enroll`
  - `GET /api/my-courses` → `verifyToken`, `requireRole('student')` → `enrollmentController.getMyCourses`
  - `GET /api/analytics` → `verifyToken`, `requireRole('admin')` → `enrollmentController.getAnalytics`
  - Mount in `app.js` at `/api`

---

### Phase 8: User Controller and Routes

- [x] 8.1 Create User Controller (`LMSBackend/src/controller/userController.js`)
  - `getAllUsers`: return all users excluding `password` field; return 200
  - `deleteUser`: find and delete user by id; return 404 if not found; return success message
  - `getProfile`: return `req.user.id` user record excluding `password`; return 404 if not found

- [x] 8.2 Create user routes (`LMSBackend/src/routes/userRoutes.js`)
  - `GET /api/users` → `verifyToken`, `requireRole('admin')` → `userController.getAllUsers`
  - `DELETE /api/users/:id` → `verifyToken`, `requireRole('admin')` → `userController.deleteUser`
  - `GET /api/users/profile` → `verifyToken` → `userController.getProfile`
  - Mount in `app.js` at `/api`

---

### Phase 9: Frontend — Auth Context and Protected Routes

- [x] 9.1 Create AuthContext (`LearningManagementSystem/src/context/AuthContext.jsx`)
  - On mount, read `token` and `user` from `localStorage` to restore session
  - `login(data)`: store `data.token` and `data.user` in state and `localStorage`
  - `logout()`: clear state and remove `token`/`user` from `localStorage`
  - Expose `{ user, token, login, logout, isAuthenticated, role }` via `useAuth` hook
  - Wrap app in `AuthProvider` inside `main.jsx`

- [x] 9.2 Create ProtectedRoute (`LearningManagementSystem/src/routes/ProtectedRoute.jsx`)
  - If not authenticated, redirect to `/login`
  - If `allowedRoles` provided and `role` not in list, redirect to `/`
  - Otherwise render `<Outlet />`

- [x] 9.3 Update `api.js` response interceptor
  - Add a response interceptor that catches 401 responses
  - On 401: clear `localStorage` (`token`, `user`) and redirect to `/login`

---

### Phase 10: Frontend — Service Modules

- [x] 10.1 Create `authService.js` (`LearningManagementSystem/src/services/authService.js`)
  - `register(data)` → `api.post('/api/auth/register', data)`
  - `login(data)` → `api.post('/api/auth/login', data)`

- [x] 10.2 Create `courseService.js` (`LearningManagementSystem/src/services/courseService.js`)
  - `getCourses(params?)` → `api.get('/api/courses', { params })`
  - `getCourseById(id)` → `api.get('/api/courses/${id}')`
  - `createCourse(data)` → `api.post('/api/courses', data)`
  - `updateCourse(id, data)` → `api.put('/api/courses/${id}', data)`
  - `deleteCourse(id)` → `api.delete('/api/courses/${id}')`

- [x] 10.3 Create `lessonService.js` (`LearningManagementSystem/src/services/lessonService.js`)
  - `getLessons(courseId)` → `api.get('/api/lessons/${courseId}')`
  - `createLesson(formData)` → `api.post('/api/lessons', formData, { headers: { 'Content-Type': 'multipart/form-data' } })`

- [x] 10.4 Create `enrollmentService.js` (`LearningManagementSystem/src/services/enrollmentService.js`)
  - `enroll(courseId)` → `api.post('/api/enroll', { courseId })`
  - `getMyCourses()` → `api.get('/api/my-courses')`

- [x] 10.5 Create `userService.js` (`LearningManagementSystem/src/services/userService.js`)
  - `getUsers()` → `api.get('/api/users')`
  - `deleteUser(id)` → `api.delete('/api/users/${id}')`
  - `getProfile()` → `api.get('/api/users/profile')`

---

### Phase 11: Frontend — Shared Components

- [x] 11.1 Create `CourseCard` component (`LearningManagementSystem/src/components/CourseCard.jsx`)
  - Accept `course` prop `{ _id, title, description, category, price, instructor }`
  - Display title, description, category, price, and instructor name
  - Render a `Link` to `/courses/${course._id}`
  - Show Enroll button for students who are not yet enrolled (accept optional `isEnrolled` and `onEnroll` props)

- [x] 11.2 Create `VideoPlayer` component (`LearningManagementSystem/src/components/VideoPlayer.jsx`)
  - Accept `url` and `title` props
  - Render `<video controls src={url} title={title} />` with responsive styling

---

### Phase 12: Frontend — Update Navbar and Routing

- [x] 12.1 Update `MainLayout.jsx` to show role-based navigation
  - Use `useAuth()` to get `isAuthenticated` and `role`
  - Unauthenticated: Home, Courses, Login, Register
  - Student: Home, Courses, My Courses (`/dashboard/my-courses`), Profile (`/dashboard/profile`), Logout
  - Instructor: Home, My Courses (`/dashboard/instructor/courses`), Logout
  - Admin: Dashboard (`/dashboard/admin/users`), Logout
  - Logout button calls `logout()` from AuthContext

- [x] 12.2 Update `AppRoutes.jsx` with all protected and public routes
  - Add public routes: `/about`, `/courses/:id`
  - Add student routes (wrapped in `ProtectedRoute allowedRoles={['student']}`): `/dashboard/my-courses`
  - Add shared auth route: `/dashboard/profile` (any authenticated user)
  - Add instructor routes (wrapped in `ProtectedRoute allowedRoles={['instructor']}`): `/dashboard/instructor/courses`, `/dashboard/instructor/courses/new`, `/dashboard/instructor/courses/:id/edit`, `/dashboard/instructor/lessons/upload`
  - Add admin routes (wrapped in `ProtectedRoute allowedRoles={['admin']}`): `/dashboard/admin/users`, `/dashboard/admin/courses`, `/dashboard/admin/analytics`

---

### Phase 13: Frontend — Auth Pages

- [x] 13.1 Implement `LoginPage.jsx`
  - Form with email and password fields
  - On submit: call `authService.login()`, then `login(data)` from AuthContext
  - Redirect to appropriate dashboard based on role after login
  - Show inline error message on failure

- [x] 13.2 Implement `RegisterPage.jsx`
  - Form with name, email, password, and role (select: student / instructor) fields
  - On submit: call `authService.register()`, then `login(data)` from AuthContext
  - Redirect to appropriate dashboard based on role after registration
  - Show inline error message on failure (including 409 duplicate email)

---

### Phase 14: Frontend — Public Pages

- [x] 14.1 Implement `CoursesPage.jsx`
  - Fetch all courses via `courseService.getCourses()`
  - Render a grid of `CourseCard` components
  - Add category filter and search input that pass `?category=` and `?search=` params
  - Show loading state while fetching

- [x] 14.2 Create `CourseDetailPage.jsx` (`LearningManagementSystem/src/pages/CourseDetailPage.jsx`)
  - Fetch course by ID via `courseService.getCourseById(id)`
  - Display course details (title, description, category, price, instructor)
  - If student and not enrolled: show Enroll button that calls `enrollmentService.enroll()`
  - If student and enrolled: show lesson list with `VideoPlayer` for each lesson
  - Fetch lessons via `lessonService.getLessons(courseId)` when enrolled

- [x] 14.3 Update `HomePage.jsx`
  - Display a hero section with LMS branding
  - Show a preview of featured/recent courses using `CourseCard`

---

### Phase 15: Frontend — Student Dashboard

- [x] 15.1 Create `MyCoursesPage.jsx` (`LearningManagementSystem/src/pages/MyCoursesPage.jsx`)
  - Fetch enrolled courses via `enrollmentService.getMyCourses()`
  - Render enrolled courses using `CourseCard` with a link to the course detail page
  - Show empty state message if no enrollments

---

### Phase 16: Frontend — Instructor Dashboard

- [x] 16.1 Create `InstructorCoursesPage.jsx` (`LearningManagementSystem/src/pages/InstructorCoursesPage.jsx`)
  - Fetch instructor's own courses (filter by instructor id from `useAuth`)
  - Display courses in a table or card list with Edit and Delete actions
  - Delete calls `courseService.deleteCourse(id)` and refreshes the list

- [x] 16.2 Create `CreateCoursePage.jsx` (`LearningManagementSystem/src/pages/CreateCoursePage.jsx`)
  - Form with title, description, category, and price fields
  - On submit: call `courseService.createCourse(data)`
  - Redirect to `/dashboard/instructor/courses` on success

- [x] 16.3 Create `EditCoursePage.jsx` (`LearningManagementSystem/src/pages/EditCoursePage.jsx`)
  - Pre-populate form with existing course data fetched by ID
  - On submit: call `courseService.updateCourse(id, data)`
  - Redirect to `/dashboard/instructor/courses` on success

- [x] 16.4 Create `UploadLessonPage.jsx` (`LearningManagementSystem/src/pages/UploadLessonPage.jsx`)
  - Form with title, course selector (instructor's own courses), and video file input
  - On submit: build `FormData` and call `lessonService.createLesson(formData)`
  - Show upload progress or success/error feedback

---

### Phase 17: Frontend — Admin Dashboard

- [x] 17.1 Create `ManageUsersPage.jsx` (`LearningManagementSystem/src/pages/ManageUsersPage.jsx`)
  - Fetch all users via `userService.getUsers()`
  - Display in a table with name, email, role columns
  - Delete button calls `userService.deleteUser(id)` and refreshes the list

- [x] 17.2 Create `AdminCoursesPage.jsx` (`LearningManagementSystem/src/pages/AdminCoursesPage.jsx`)
  - Fetch all courses via `courseService.getCourses()`
  - Display in a table with title, instructor, category, price columns
  - Delete button calls `courseService.deleteCourse(id)` and refreshes the list

- [x] 17.3 Create `AnalyticsPage.jsx` (`LearningManagementSystem/src/pages/AnalyticsPage.jsx`)
  - Fetch analytics via `api.get('/api/analytics')`
  - Display total enrollments per course in a table or simple chart

---

### Phase 18: Frontend — Profile Page

- [x] 18.1 Create `ProfilePage.jsx` (`LearningManagementSystem/src/pages/ProfilePage.jsx`)
  - Fetch own profile via `userService.getProfile()`
  - Display name, email, and role
  - (Optional) Allow updating name via `userService.updateProfile(data)`

---

### Phase 19: Testing

- [ ] 19.1 Set up backend test infrastructure
  - Install `jest`, `supertest`, `mongodb-memory-server` as dev dependencies in `LMSBackend/`
  - Add `"test": "jest"` script to `package.json`
  - Create `LMSBackend/src/__tests__/` directory

- [ ] 19.2 Write unit tests for Auth Controller
  - Test `register` rejects duplicate emails (409)
  - Test `register` rejects short passwords (400)
  - Test `login` returns 401 for wrong password
  - Test `login` returns 401 for unknown email
  - Test response never contains `password` field

- [ ] 19.3 Write unit tests for middleware
  - Test `verifyToken` returns 401 for missing token
  - Test `verifyToken` returns 401 for malformed token
  - Test `verifyToken` returns 401 for expired token
  - Test `verifyToken` attaches `{ id, role }` to `req.user` for valid token
  - Test `requireRole` returns 403 for non-matching role
  - Test `requireRole` calls `next()` for matching role

- [ ] 19.4 Write integration tests for auth flow
  - Full flow: register → login → access protected route with returned token
  - Verify JWT can be decoded and contains correct `id` and `role`

- [ ] 19.5 Write integration tests for course ownership
  - Create two instructors; instructor A creates a course; instructor B attempts update/delete → 403
  - Admin can update/delete any course

- [ ] 19.6 Write integration tests for enrollment
  - Student enrolls in a course → 201
  - Student enrolls again → 409
  - `GET /api/my-courses` returns the enrolled course

- [ ] 19.7 Set up frontend test infrastructure (optional)
  - Install `vitest` and `@testing-library/react` as dev dependencies in `LearningManagementSystem/`
  - Add `"test": "vitest --run"` script to `package.json`

- [ ] 19.8 Write frontend component tests (optional)
  - Test `CourseCard` renders all required fields for a given course object
  - Test `ProtectedRoute` redirects unauthenticated users to `/login`
  - Test `AuthContext` login/logout correctly updates `localStorage`
