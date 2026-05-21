import React, { useEffect, useState } from "react";
import { Badge, Col, Container, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { BookOpen, Users, Video, BarChart3 } from "lucide-react";
import api from "../../services/api.js";

/* ── Summary Stat Card ─────────────────────────────────── */
function SummaryCard({ icon, label, value, gradient }) {
  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius)",
        padding: "1.5rem 1.25rem",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, border-color 0.2s",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = "var(--border-brand)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = "var(--border-1)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: gradient,
        }}
      />
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--radius-sm)",
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
          margin: "0 auto 0.9rem",
          boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
        }}
      >
        {icon && typeof icon === "function"
          ? React.createElement(icon, { size: 28, color: "#fff" })
          : icon}
      </div>
      <div
        style={{
          color: "var(--text-1)",
          fontWeight: 800,
          fontSize: "1.9rem",
          lineHeight: 1,
          marginBottom: "0.3rem",
        }}
      >
        {value}
      </div>
      <div
        style={{ color: "var(--text-3)", fontSize: "0.8rem", fontWeight: 500 }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
function AnalyticsPage() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/analytics");
        if (!cancelled) setAnalytics(res.data);
      } catch (err) {
        if (!cancelled)
          toast.error("Failed to load analytics. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalEnrollments = analytics.reduce(
    (s, r) => s + (r.totalEnrollments || 0),
    0,
  );
  const totalLessons = analytics.reduce((s, r) => s + (r.totalLessons || 0), 0);
  const totalCourses = analytics.length;
  const avgEnrollments =
    totalCourses > 0 ? (totalEnrollments / totalCourses).toFixed(1) : 0;
  const maxEnrollments =
    analytics.length > 0
      ? Math.max(...analytics.map((r) => r.totalEnrollments || 0))
      : 1;

  const rankMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <Container className="page-section py-5">
      {/* Header */}
      <div className="section-heading mb-4">
        <span className="eyebrow mb-1">Admin Panel</span>
        <h1 className="h2 fw-bold mb-0" style={{ color: "var(--text-1)" }}>
          Analytics
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3" style={{ color: "var(--text-2)" }}>
            Loading analytics...
          </p>
        </div>
      ) : analytics.length === 0 ? (
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius)",
            padding: "4rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            <BarChart3 size={40} style={{ margin: "0 auto" }} />
          </div>
          <p style={{ color: "var(--text-2)", margin: 0 }}>
            No analytics data yet. Enroll some students to see data here.
          </p>
        </div>
      ) : (
        <>
          {/* ── Summary Cards ── */}
          <Row className="g-3 mb-5">
            <Col xs={6} md={3}>
              <SummaryCard
                icon={BookOpen}
                label="Total Courses"
                value={totalCourses}
                gradient="linear-gradient(135deg,#667eea,#764ba2)"
              />
            </Col>
            <Col xs={6} md={3}>
              <SummaryCard
                icon={Users}
                label="Total Enrollments"
                value={totalEnrollments}
                gradient="linear-gradient(135deg,#11998e,#38ef7d)"
              />
            </Col>
            <Col xs={6} md={3}>
              <SummaryCard
                icon={Video}
                label="Total Lessons"
                value={totalLessons}
                gradient="linear-gradient(135deg,#2193b0,#6dd5ed)"
              />
            </Col>
            <Col xs={6} md={3}>
              <SummaryCard
                icon={BarChart3}
                label="Avg. Enrollments"
                value={avgEnrollments}
                gradient="linear-gradient(135deg,#f7971e,#ffd200)"
              />
            </Col>
          </Row>

          {/* ── Table ── */}
          <div className="section-heading mb-3">
            <span className="eyebrow mb-1">Breakdown</span>
            <h2 className="h4 fw-bold mb-0" style={{ color: "var(--text-1)" }}>
              Course Overview Table
            </h2>
          </div>

          <div className="table-responsive mb-5">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>Course Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th style={{ textAlign: "center" }}>Total Lessons</th>
                  <th style={{ textAlign: "center" }}>Total Enrollments</th>
                  <th style={{ minWidth: "140px" }}>Enrollment Share</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((row, idx) => {
                  const pct =
                    maxEnrollments > 0
                      ? Math.round(
                          (row.totalEnrollments / maxEnrollments) * 100,
                        )
                      : 0;
                  return (
                    <tr key={row._id || idx}>
                      {/* Rank */}
                      <td
                        style={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          textAlign: "center",
                        }}
                      >
                        {rankMedal(idx + 1)}
                      </td>

                      {/* Course name */}
                      <td style={{ fontWeight: 600, color: "var(--text-1)" }}>
                        {row.courseTitle || "—"}
                      </td>

                      {/* Category */}
                      <td>
                        {row.courseCategory ? (
                          <Badge bg="secondary">{row.courseCategory}</Badge>
                        ) : (
                          <span style={{ color: "var(--text-3)" }}>—</span>
                        )}
                      </td>

                      {/* Price */}
                      <td style={{ color: "var(--brand)", fontWeight: 700 }}>
                        {row.coursePrice === 0
                          ? "Free"
                          : row.coursePrice !== undefined
                            ? `$${row.coursePrice}`
                            : "—"}
                      </td>

                      {/* Lessons */}
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            background: "rgba(56,239,125,0.1)",
                            border: "1px solid rgba(56,239,125,0.2)",
                            borderRadius: "999px",
                            padding: "0.2rem 0.65rem",
                            color: "#38ef7d",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                          }}
                        >
                          <Video size={16} style={{ marginRight: "0.4rem" }} />{" "}
                          {row.totalLessons ?? 0}
                        </span>
                      </td>

                      {/* Enrollments */}
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            background: "rgba(124,111,247,0.1)",
                            border: "1px solid rgba(124,111,247,0.2)",
                            borderRadius: "999px",
                            padding: "0.2rem 0.65rem",
                            color: "#c4b5fd",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                          }}
                        >
                          <Users size={16} style={{ marginRight: "0.4rem" }} />{" "}
                          {row.totalEnrollments ?? 0}
                        </span>
                      </td>

                      {/* Progress bar */}
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              height: "6px",
                              background: "var(--surface-3)",
                              borderRadius: "999px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                background:
                                  "linear-gradient(90deg,#667eea,#764ba2)",
                                borderRadius: "999px",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: "var(--text-3)",
                              fontSize: "0.75rem",
                              minWidth: "32px",
                            }}
                          >
                            {pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Totals footer */}
              <tfoot>
                <tr style={{ borderTop: "2px solid var(--border-2)" }}>
                  <td
                    colSpan={4}
                    style={{
                      fontWeight: 700,
                      color: "var(--text-2)",
                      fontSize: "0.82rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Totals
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        background: "rgba(56,239,125,0.15)",
                        border: "1px solid rgba(56,239,125,0.3)",
                        borderRadius: "999px",
                        padding: "0.2rem 0.65rem",
                        color: "#38ef7d",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                      }}
                    >
                      <Video size={16} style={{ marginRight: "0.4rem" }} />{" "}
                      {totalLessons}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        background: "rgba(124,111,247,0.15)",
                        border: "1px solid rgba(124,111,247,0.3)",
                        borderRadius: "999px",
                        padding: "0.2rem 0.65rem",
                        color: "#c4b5fd",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                      }}
                    >
                      <Users size={16} style={{ marginRight: "0.4rem" }} />{" "}
                      {totalEnrollments}
                    </span>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </Container>
  );
}

export default AnalyticsPage;
