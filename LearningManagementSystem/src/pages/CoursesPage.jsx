import { Card, Col, Container, Row } from "react-bootstrap";

const courses = [
  {
    title: "Web Development",
    description: "Build modern websites with React, HTML, CSS, and JavaScript.",
  },
  {
    title: "Database Systems",
    description: "Organize data with MongoDB and model it using Mongoose.",
  },
  {
    title: "Authentication",
    description: "Secure accounts using JWT and bcrypt-based password hashing.",
  },
];

function CoursesPage() {
  return (
    <Container className="page-section py-5">
      <div className="section-heading mb-4">
        <p className="eyebrow mb-2">Courses</p>
        <h1 className="h2 fw-bold text-white mb-0">Featured learning tracks</h1>
      </div>
      <Row className="g-4">
        {courses.map((course) => (
          <Col key={course.title} md={4}>
            <Card className="h-100 border-0 course-card">
              <Card.Body className="p-4">
                <Card.Title className="fw-bold">{course.title}</Card.Title>
                <Card.Text className="text-white-50">
                  {course.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CoursesPage;
