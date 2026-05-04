import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard.jsx';
import * as courseService from '../services/courseService.js';

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await courseService.getCourses();
        setCourses(res.data.slice(0, 3));
      } catch {
        // silently fail — featured section is non-critical
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="page-wrap">
      <Container>
        {/* Hero Section */}
        <Row className="align-items-center g-4 py-5">
          <Col lg={7}>
            <p className="eyebrow mb-3">Learning Management System</p>
            <h1 className="display-4 fw-bold text-white mb-3">
              Manage learning, students, and courses in one clean dashboard.
            </h1>
            <p className="lead text-white-50 mb-4">
              React Router, Axios, Bootstrap, and React Bootstrap are configured
              and ready for your LMS frontend workflows.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Button as={Link} to="/register" variant="light" size="lg">
                Get Started
              </Button>
              <Button as={Link} to="/courses" variant="outline-light" size="lg">
                Browse Courses
              </Button>
            </div>
          </Col>
        </Row>

        {/* Featured Courses Section */}
        <Row className="py-4">
          <Col>
            <div className="section-heading mb-4">
              <p className="eyebrow mb-2">Featured</p>
              <h2 className="h3 fw-bold text-white mb-0">Popular courses</h2>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="light" />
                <p className="text-white-50 mt-3">Loading courses...</p>
              </div>
            ) : courses.length > 0 ? (
              <>
                <Row className="g-4">
                  {courses.map((course) => (
                    <Col key={course._id} md={4}>
                      <CourseCard course={course} />
                    </Col>
                  ))}
                </Row>
                <div className="text-center mt-4">
                  <Button as={Link} to="/courses" variant="outline-light">
                    Browse All Courses
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-white-50">No courses available yet.</p>
                <Button as={Link} to="/courses" variant="outline-light">
                  Browse All Courses
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
