import { Badge, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function CourseCard({ course, isEnrolled, onEnroll }) {
  const { role } = useAuth();

  return (
    <Card className="h-100 course-card">
      <Card.Body className="p-4 d-flex flex-column gap-2">

        <div className="d-flex justify-content-between align-items-center">
          <Badge bg="secondary">{course.category}</Badge>
          <span style={{ color: 'var(--brand)', fontWeight: 700, fontSize: '0.9rem' }}>
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
        </div>

        <Card.Title style={{ fontSize: '0.975rem', fontWeight: 600, marginBottom: 0 }}>
          <Link to={`/courses/${course._id}`} style={{ color: 'var(--text-1)' }}>
            {course.title}
          </Link>
        </Card.Title>

        <Card.Text
          className="flex-grow-1"
          style={{ color: 'var(--text-2)', fontSize: '0.845rem', lineHeight: 1.65, marginBottom: 0 }}
        >
          {course.description?.length > 110
            ? course.description.slice(0, 110) + '…'
            : course.description}
        </Card.Text>

        {course.instructor?.name && (
          <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', marginBottom: 0 }}>
            By{' '}
            <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>
              {course.instructor.name}
            </span>
          </p>
        )}

        <div className="mt-1">
          {role === 'student' ? (
            isEnrolled ? (
              <Button as={Link} to={`/courses/${course._id}`} variant="outline-light" size="sm" className="w-100">
                Continue Learning →
              </Button>
            ) : (
              <Button
                variant="light"
                size="sm"
                className="w-100"
                onClick={() => onEnroll && onEnroll(course._id)}
              >
                Enroll Now
              </Button>
            )
          ) : (
            <Button as={Link} to={`/courses/${course._id}`} variant="outline-light" size="sm" className="w-100">
              View Course
            </Button>
          )}
        </div>

      </Card.Body>
    </Card>
  );
}

export default CourseCard;
