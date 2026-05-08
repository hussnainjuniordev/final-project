import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Link, NavLink, Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function MainLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-shell">
      <Navbar expand="lg" className="app-navbar" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="brand-icon">
              <GraduationCap size={20} color="#fff" style={{ verticalAlign: "middle" }} />
            </span>
            <span className="brand-text">LMS Portal</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto gap-lg-1 align-items-lg-center">
              <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/courses">Courses</Nav.Link>
              <Nav.Link as={NavLink} to="/about">About</Nav.Link>
              {!isAuthenticated ? (
                <>
                  <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                  <Button as={Link} to="/register" variant="light" size="sm" className="ms-2">
                    Get Started
                  </Button>
                </>
              ) : (
                <Button as={Link} to="/dashboard/profile" variant="light" size="sm" className="ms-2">
                  Dashboard →
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
