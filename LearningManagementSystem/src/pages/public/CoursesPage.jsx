import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import CourseCard from "../../components/CourseCard.jsx";
import * as courseService from "../../services/courseService.js";
import * as enrollmentService from "../../services/enrollmentService.js";
import { useAuth } from "../../context/AuthContext.jsx";

function CoursesPage() {
  const { role } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchCourses = async (params = {}) => {
    setLoading(true);
    try {
      const res = await courseService.getCourses(params);
      setCourses(res.data);
    } catch (err) {
      toast.error("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolled = async () => {
    if (role !== "student") return;
    try {
      const res = await enrollmentService.getMyCourses();
      const ids = res.data.map((e) => e.course?._id || e._id);
      setEnrolledIds(ids);
    } catch {
      // non-critical
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrolled();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchCourses({ search: val, category });
  };

  const handleCategory = (e) => {
    const val = e.target.value;
    setCategory(val);
    fetchCourses({ search, category: val });
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollmentService.enroll(courseId);
      toast.success("Enrolled successfully!");
      setEnrolledIds((prev) => [...prev, courseId]);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to enroll. Please try again.",
      );
    }
  };

  return (
    <Container className="page-section py-5">
      <div className="section-heading mb-4">
        <span className="eyebrow mb-2">Courses</span>
        <h1 className="h2 fw-bold text-white mb-0">Browse all courses</h1>
      </div>

      <Row className="g-3 mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={handleSearch}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Filter by category..."
            value={category}
            onChange={handleCategory}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
          <p className="text-white-50 mt-3">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-white-50">No courses found.</p>
      ) : (
        <Row className="g-4">
          {courses.map((course) => (
            <Col key={course._id} md={4}>
              <CourseCard
                course={course}
                isEnrolled={enrolledIds.includes(course._id)}
                onEnroll={handleEnroll}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default CoursesPage;
