import { useEffect, useState } from 'react';
import { Alert, Button, Container, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as courseService from '../services/courseService.js';

function InstructorCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await courseService.getCourses();
      const myCourses = res.data.filter(
        (c) => c.instructor?._id === user?._id
      );
      setCourses(myCourses);
    } catch {
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseService.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch {
      setError('Failed to delete course. Please try again.');
    }
  };

  return (
    <Container className="page-section py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="eyebrow mb-1">Instructor</p>
          <h1 className="h2 fw-bold text-white mb-0">My Courses</h1>
        </div>
        <Button as={Link} to="/dashboard/instructor/courses/new" variant="light">
          Create New Course
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
          <p className="text-white-50 mt-3">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-white-50">You haven&apos;t created any courses yet.</p>
      ) : (
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.category}</td>
                <td>{course.price === 0 ? 'Free' : `$${course.price}`}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/dashboard/instructor/courses/${course._id}/edit`}
                    variant="outline-light"
                    size="sm"
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default InstructorCoursesPage;
