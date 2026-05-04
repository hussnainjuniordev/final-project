import { useEffect, useState } from 'react';
import { Alert, Button, Container, Spinner, Table } from 'react-bootstrap';
import * as courseService from '../services/courseService.js';

function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await courseService.getCourses();
      setCourses(res.data);
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
      <div className="section-heading mb-4">
        <p className="eyebrow mb-2">Admin</p>
        <h1 className="h2 fw-bold text-white mb-0">Manage Courses</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
          <p className="text-white-50 mt-3">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-white-50">No courses found.</p>
      ) : (
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Instructor</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.instructor?.name || '—'}</td>
                <td>{course.category}</td>
                <td>{course.price === 0 ? 'Free' : `$${course.price}`}</td>
                <td>
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

export default AdminCoursesPage;
