import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// Public pages
import HomePage from '../pages/public/HomePage.jsx';
import CoursesPage from '../pages/public/CoursesPage.jsx';
import CourseDetailPage from '../pages/public/CourseDetailPage.jsx';
import AboutPage from '../pages/public/AboutPage.jsx';
import NotFoundPage from '../pages/public/NotFoundPage.jsx';

// Auth pages (common for all users)
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';

// Student pages
import MyCoursesPage from '../pages/student/MyCoursesPage.jsx';

// Shared pages (any authenticated user)
import ProfilePage from '../pages/shared/ProfilePage.jsx';

// Instructor pages
import InstructorCoursesPage from '../pages/instructor/InstructorCoursesPage.jsx';
import CreateCoursePage from '../pages/instructor/CreateCoursePage.jsx';
import EditCoursePage from '../pages/instructor/EditCoursePage.jsx';
import UploadLessonPage from '../pages/instructor/UploadLessonPage.jsx';
import InstructorCourseLessonsPage from '../pages/instructor/InstructorCourseLessonsPage.jsx';

// Admin pages
import ManageUsersPage from '../pages/admin/ManageUsersPage.jsx';
import AdminCoursesPage from '../pages/admin/AdminCoursesPage.jsx';
import AnalyticsPage from '../pages/admin/AnalyticsPage.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Guest-only routes — redirect if already logged in */}
        <Route element={<ProtectedRoute guestOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Student routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/dashboard/my-courses" element={<MyCoursesPage />} />
        </Route>

        {/* Shared authenticated routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/profile" element={<ProfilePage />} />
        </Route>

        {/* Instructor routes */}
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route path="/dashboard/instructor/courses" element={<InstructorCoursesPage />} />
          <Route path="/dashboard/instructor/courses/new" element={<CreateCoursePage />} />
          <Route path="/dashboard/instructor/courses/:id/edit" element={<EditCoursePage />} />
          <Route path="/dashboard/instructor/courses/:id/lessons" element={<InstructorCourseLessonsPage />} />
          <Route path="/dashboard/instructor/lessons/upload" element={<UploadLessonPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard/admin/users" element={<ManageUsersPage />} />
          <Route path="/dashboard/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/dashboard/admin/analytics" element={<AnalyticsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
