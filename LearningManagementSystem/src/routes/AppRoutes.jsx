import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// Public pages
import HomePage from '../pages/HomePage.jsx';
import CoursesPage from '../pages/CoursesPage.jsx';
import CourseDetailPage from '../pages/CourseDetailPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import AboutPage from '../pages/AboutPage.jsx';

// Student pages
import MyCoursesPage from '../pages/MyCoursesPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';

// Instructor pages
import InstructorCoursesPage from '../pages/InstructorCoursesPage.jsx';
import CreateCoursePage from '../pages/CreateCoursePage.jsx';
import EditCoursePage from '../pages/EditCoursePage.jsx';
import UploadLessonPage from '../pages/UploadLessonPage.jsx';

// Admin pages
import ManageUsersPage from '../pages/ManageUsersPage.jsx';
import AdminCoursesPage from '../pages/AdminCoursesPage.jsx';
import AnalyticsPage from '../pages/AnalyticsPage.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

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
