import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

function LoginPage() {
  return (
    <Container className="page-section py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <Card className="border-0 auth-card shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <p className="eyebrow mb-2">Login</p>
              <h1 className="h3 fw-bold mb-4 text-white">Welcome back</h1>
              <Form>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter password" />
                </Form.Group>
                <Button variant="light" className="w-100" type="submit">
                  Sign In
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
