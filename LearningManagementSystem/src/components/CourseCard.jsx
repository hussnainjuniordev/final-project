import { Badge, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function CourseCard({ course, isEnrolled, onEnroll }) {
  const { role } = useAuth();

  return (
    <Card className="h-100 border-0 course-card shadow-sm">
      <Card.Body className="p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="secondary" className="text-uppercase">{course.category}</Badge>
          <span className="fw-bold text-white">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
        </div>
        <Card.Title className="fw-bold mb-1">
          <Link to={`/courses/${course._id}`} className="text-white text-decoration-none">
            {course.title}
          </Link>
        </Card.Title>
        <Card.Text className="text-white-50 flex-grow-1">{course.description}</Card.Text>
        {course.instructor?.name && (
          <p className="text-white-50 small mb-3">By {course.instructor.name}</p>
        )}
        {role === 'student' && (
          isEnrolled ? (
            <Button as={Link} to={`/courses/${course._id}`} variant="outline-light" size="sm">
              Continue Learning
            </Button>
          ) : (
            <Button variant="light" size="sm" onClick={() => onEnroll && onEnroll(course._id)}>
              Enroll Now
            </Button>
          )
        )}
        {role !== 'student' && (
          <Button as={Link} to={`/courses/${course._id}`} variant="outline-light" size="sm">
            View Course
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default CourseCard;
