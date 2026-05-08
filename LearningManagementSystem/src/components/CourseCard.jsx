import { Badge, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const gradients = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #06b6d4, #10b981)',
  'linear-gradient(135deg, #3b82f6, #6366f1)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
];

function getGradient(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
}

function CourseCard({ course, isEnrolled, onEnroll }) {
  const { role } = useAuth();
  const navigate = useNavigate();
  const accentGrad = getGradient(course._id || course.title || '');

  const handleEnrollClick = async () => {
    if (onEnroll) {
      await onEnroll(course._id);
    }
    navigate(`/courses/${course._id}`);
  };

  return (
    <Card className="h-100 course-card">
      <div style={{ height: '3px', background: accentGrad }} />
      <Card.Body className="p-4 d-flex flex-column gap-3">

        <div className="d-flex justify-content-between align-items-center">
          <Badge bg="secondary">{course.category}</Badge>
          <span style={{
            background: course.price === 0
              ? 'linear-gradient(135deg, #06b6d4, #10b981)'
              : accentGrad,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
            fontSize: '0.9rem',
          }}>
            {course.price === 0 ? 'Free' : `Rs.${course.price}`}
          </span>
        </div>

        <Card.Title style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 0, lineHeight: 1.4 }}>
          <Link to={`/courses/${course._id}`} style={{ color: 'var(--text-1)' }}>
            {course.title}
          </Link>
        </Card.Title>

        <Card.Text
          className="flex-grow-1"
          style={{ color: 'var(--text-2)', fontSize: '0.845rem', lineHeight: 1.7, marginBottom: 0 }}
        >
          {course.description?.length > 110
            ? course.description.slice(0, 110) + '…'
            : course.description}
        </Card.Text>

        {course.instructor?.name && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
          }}>
            <div style={{
              width: 26, height: 26,
              borderRadius: '50%',
              background: accentGrad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <BookOpen size={13} color="#fff" />
            </div>
            <span style={{ color: 'var(--text-2)', fontSize: '0.78rem', fontWeight: 500 }}>
              {course.instructor.name}
            </span>
          </div>
        )}

        <div className="mt-auto">
          {role === 'student' ? (
            isEnrolled ? (
              <Button as={Link} to={`/courses/${course._id}`} variant="outline-light" size="sm" className="w-100">
                Continue Learning <ArrowRight size={14} style={{ marginLeft: '0.3rem' }} />
              </Button>
            ) : (
             <Button variant="light" size="sm" className="w-100" style={{ height: '38px' }} onClick={handleEnrollClick}>
                View Details
              </Button>
            )
          ) : (
            <Button as={Link} to={`/courses/${course._id}`} variant="outline-light" size="sm" className="w-100">
              View Course <ArrowRight size={14} style={{ marginLeft: '0.3rem' }} />
            </Button>
          )}
        </div>

      </Card.Body>
    </Card>
  );
}

export default CourseCard;
