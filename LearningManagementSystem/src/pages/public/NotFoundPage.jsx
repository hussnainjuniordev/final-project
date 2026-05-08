import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Container className="page-section py-5 text-center">
      <span className="eyebrow mb-2">404</span>
      <h1 className="display-5 fw-bold text-white mb-3">Page not found</h1>
      <p className="text-white-50 mb-4">
        The page you are looking for does not exist.
      </p>
      <Button as={Link} to="/" variant="light">
        Back to Home
      </Button>
    </Container>
  );
}

export default NotFoundPage;
