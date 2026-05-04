import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function MainLayout() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <Navbar expand="lg" className="app-navbar" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-semibold">
            LMS Portal
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto gap-lg-2 align-items-lg-center">
              {!isAuthenticated && (
                <>
                  <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                  <Nav.Link as={NavLink} to="/courses">Courses</Nav.Link>
                  <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                  <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                </>
              )}
              {isAuthenticated && role === 'student' && (
                <>
                  <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                  <Nav.Link as={NavLink} to="/courses">Courses</Nav.Link>
                  <Nav.Link as={NavLink} to="/dashboard/my-courses">My Courses</Nav.Link>
                  <Nav.Link as={NavLink} to="/dashboard/profile">Profile</Nav.Link>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              )}
              {isAuthenticated && role === 'instructor' && (
                <>
                  <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                  <Nav.Link as={NavLink} to="/dashboard/instructor/courses">My Courses</Nav.Link>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              )}
              {isAuthenticated && role === 'admin' && (
                <>
                  <Nav.Link as={NavLink} to="/dashboard/admin/users">Dashboard</Nav.Link>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
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
