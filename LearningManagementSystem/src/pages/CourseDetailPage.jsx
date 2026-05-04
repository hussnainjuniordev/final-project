import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as courseService from '../services/courseService.js';
import * as enrollmentService from '../services/enrollmentService.js';
import * as lessonService from '../services/lessonService.js';

function CourseDetailPage() {
  const { id } = useParams();
  const { role } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  const fetchLessons = async () => {
    try {
      const res = await lessonService.getLessons(id);
      setLessons(res.data);
    } catch {
      // lessons may not be available
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await enrollmentService.getMyCourses();
      const enrolled = res.data.some(
        (e) => (e.course?._id || e._id) === id
      );
      setIsEnrolled(enrolled);
      if (enrolled) {
        await fetchLessons();
      }
    } catch {
      // non-critical
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await courseService.getCourseById(id);
        setCourse(res.data);
        if (role === 'student') {
          await checkEnrollment();
        } else {
          await fetchLessons();
        }
      } catch {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError('');
    try {
      await enrollmentService.enroll(id);
      setIsEnrolled(true);
      await fetchLessons();
    } catch {
      setError('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Container className="page-section py-5 text-center">
        <Spinner animation="border" variant="light" />
        <p className="text-white-50 mt-3">Loading course...</p>
      </Container>
    );
  }

  if (error && !course) {
    return (
      <Container className="page-section py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="page-section py-5">
      {error && <Alert variant="danger">{error}</Alert>}

      {course && (
        <>
          <Row className="mb-4">
            <Col>
              <Badge bg="secondary" className="text-uppercase mb-2">
                {course.category}
              </Badge>
              <h1 className="fw-bold text-white">{course.title}</h1>
              <p className="text-white-50 lead">{course.description}</p>
              {course.instructor?.name && (
                <p className="text-white-50">
                  Instructor: <strong className="text-white">{course.instructor.name}</strong>
                </p>
              )}
              <p className="text-white fw-bold fs-5">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </p>
            </Col>
          </Row>

          {role === 'student' && !isEnrolled && (
            <Button
              variant="light"
              onClick={handleEnroll}
              disabled={enrolling}
              className="mb-4"
            >
              {enrolling ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Enrolling...
                </>
              ) : (
                'Enroll Now'
              )}
            </Button>
          )}

          {(isEnrolled || role !== 'student') && lessons.length > 0 && (
            <div className="mt-4">
              <h2 className="h4 fw-bold text-white mb-3">Lessons</h2>
              {lessons.map((lesson) => (
                <div key={lesson._id} className="mb-4">
                  <h3 className="h6 text-white mb-2">{lesson.title}</h3>
                  {lesson.videoUrl && (
                    <VideoPlayer url={lesson.videoUrl} title={lesson.title} />
                  )}
                </div>
              ))}
            </div>
          )}

          {(isEnrolled || role !== 'student') && lessons.length === 0 && (
            <p className="text-white-50 mt-4">No lessons available yet.</p>
          )}
        </>
      )}
    </Container>
  );
}

export default CourseDetailPage;
