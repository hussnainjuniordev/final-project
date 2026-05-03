import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

function RegisterPage() {
  return (
    <Container className="page-section py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={6}>
          <Card className="border-0 auth-card shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <p className="eyebrow mb-2">Register</p>
              <h1 className="h3 fw-bold mb-4 text-white">
                Create your account
              </h1>
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="firstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control type="text" placeholder="First name" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" placeholder="Last name" />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="my-3" controlId="registerEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-4" controlId="registerPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Create password" />
                </Form.Group>
                <Button variant="light" className="w-100" type="submit">
                  Create Account
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
