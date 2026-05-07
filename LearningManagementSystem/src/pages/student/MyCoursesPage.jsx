import { useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CourseCard from "../../components/CourseCard.jsx";
import * as enrollmentService from "../../services/enrollmentService.js";

function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      setLoading(true);
      try {
        const res = await enrollmentService.getMyCourses();
        // Each enrollment may have a nested course object
        const courseList = res.data.map((e) => e.course || e);
        setCourses(courseList);
      } catch (err) {
        toast.error("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  return (
    <Container className="page-section py-5">
      <div className="section-heading mb-4">
        <p className="eyebrow mb-2">My Learning</p>
        <h1 className="h2 fw-bold text-white mb-0">My Courses</h1>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
          <p className="text-white-50 mt-3">Loading your courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-white-50 mb-3">
            You haven&apos;t enrolled in any courses yet. Browse courses to get
            started.
          </p>
          <Link to="/courses" className="btn btn-light">
            Browse Courses
          </Link>
        </div>
      ) : (
        <Row className="g-4">
          {courses.map((course) => (
            <Col key={course._id} md={4}>
              <CourseCard course={course} isEnrolled={true} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default MyCoursesPage;
