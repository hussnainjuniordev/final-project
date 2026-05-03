import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="page-wrap">
      <Container>
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
          <Col lg={5}>
            <Card className="feature-card border-0 shadow-lg">
              <Card.Body className="p-4 p-md-5">
                <h2 className="h4 fw-bold mb-3">Frontend stack ready</h2>
                <ul className="feature-list mb-0">
                  <li>Client-side routing with React Router</li>
                  <li>API client with Axios</li>
                  <li>Bootstrap + React Bootstrap styling</li>
                  <li>Central layout for future dashboard pages</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
