import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function MainLayout() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <Navbar expand="lg" className="app-navbar" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="brand-icon">
              <GraduationCap size={24} style={{ verticalAlign: "middle" }} />
            </span>
            <span className="brand-text">LMS Portal</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto gap-lg-1 align-items-lg-center">
              {!isAuthenticated && (
                <>
                  <Nav.Link as={NavLink} to="/" end>
                    Home
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/courses">
                    Courses
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/about">
                    About
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                  <Button
                    as={Link}
                    to="/register"
                    variant="light"
                    size="sm"
                    className="ms-2"
                  >
                    Get Started
                  </Button>
                </>
              )}

              {isAuthenticated && role === "student" && (
                <>
                  <Nav.Link as={NavLink} to="/" end>
                    Home
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/courses">
                    Courses
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/dashboard/my-courses">
                    My Courses
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/dashboard/profile">
                    Profile
                  </Nav.Link>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}

              {isAuthenticated && role === "instructor" && (
                <>
                  <Nav.Link as={NavLink} to="/" end>
                    Home
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/dashboard/instructor/courses">
                    My Courses
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/dashboard/instructor/lessons/upload"
                  >
                    Upload Lesson
                  </Nav.Link>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}

              {isAuthenticated && role === "admin" && (
                <>
                  <Nav.Link as={NavLink} to="/dashboard/admin/users">
                    Users
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/dashboard/admin/courses">
                    Courses
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/dashboard/admin/analytics">
                    Analytics
                  </Nav.Link>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
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
