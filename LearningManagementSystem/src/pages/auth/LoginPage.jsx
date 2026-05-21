import { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GraduationCap, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      login(response.data);
      const role = response.data.user?.role;
      if (role === "instructor") navigate("/dashboard/instructor/courses", { replace: true });
      else if (role === "admin") navigate("/dashboard/admin/users", { replace: true });
      else navigate(from || "/dashboard/my-courses", { replace: true });
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", { autoClose: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - var(--navbar-h))",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <Row className="g-0 w-100">
        {/* ── Left panel — branding ── */}
        <Col
          lg={5}
          className="d-none d-lg-flex"
          style={{
            background:
              "linear-gradient(145deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
            position: "relative",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 3rem",
            flexDirection: "column",
          }}
        >
          {/* Glow blobs */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "10%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(124,111,247,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              right: "5%",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(56,239,125,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
                boxShadow: "0 8px 32px rgba(124,111,247,0.4)",
              }}
            >
              <GraduationCap size={40} color="#fff" />
            </div>

            <h2
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.8rem",
                marginBottom: "1rem",
                letterSpacing: "-0.5px",
              }}
            >
              Welcome Back
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: "280px",
                margin: "0 auto 2.5rem",
              }}
            >
              Sign in to continue your learning journey and access your courses.
            </p>

            {/* Feature pills */}
            {[
              "Access all your courses",
              "Track your progress",
              "Watch video lessons",
            ].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "0.75rem",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #11998e, #38ef7d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    color: "#0a1a0f",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  <Check size={12} color="#0a1a0f" />
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.875rem",
                  }}
                >
                  {f}
                </span>
              </div>
            ))}
          </div>
        </Col>

        {/* ── Right panel — form ── */}
        <Col
          lg={7}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 2rem",
            background: "var(--surface-1)",
          }}
        >
          <div style={{ width: "100%", maxWidth: "420px" }}>
            <span className="eyebrow mb-3">Sign In</span>
            <h1
              style={{
                color: "var(--text-1)",
                fontWeight: 800,
                fontSize: "1.9rem",
                marginBottom: "0.5rem",
                letterSpacing: "-0.5px",
              }}
            >
              Login to your account
            </h1>
            <p
              style={{
                color: "var(--text-2)",
                fontSize: "0.9rem",
                marginBottom: "2rem",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#c4b5fd", fontWeight: 600 }}
              >
                Create one free
              </Link>
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                variant="light"
                className="w-100"
                type="submit"
                disabled={loading}
                style={{ padding: "0.7rem" }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Signing in…
                  </>
                ) : (
                  "Sign In →"
                )}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default LoginPage;
