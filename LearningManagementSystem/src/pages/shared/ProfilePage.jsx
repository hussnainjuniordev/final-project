import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { User, Mail, Shield, Calendar } from "lucide-react";
import * as userService from "../../services/userService.js";

const roleConfig = {
  student: { grad: "linear-gradient(135deg,#06b6d4,#10b981)", label: "Student" },
  instructor: { grad: "linear-gradient(135deg,#3b82f6,#6366f1)", label: "Instructor" },
  admin: { grad: "linear-gradient(135deg,#f59e0b,#ef4444)", label: "Administrator" },
};

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await userService.getProfile();
        setProfile(res.data);
      } catch {
        toast.error("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const cfg = roleConfig[profile?.role] || roleConfig.student;

  return (
    <Container className="page-section py-5" style={{ maxWidth: "560px" }}>
      <div className="section-heading mb-4">
        <span className="eyebrow mb-2">Account</span>
        <h1 className="h2 fw-bold mb-0" style={{ color: "var(--text-1)" }}>My Profile</h1>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3" style={{ color: "var(--text-2)" }}>Loading profile...</p>
        </div>
      ) : profile ? (
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          backdropFilter: "blur(12px)",
        }}>
          {/* Header banner */}
          <div style={{
            background: cfg.grad,
            padding: "2.5rem 2rem 4rem",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 80% 80% at 50% 120%, rgba(0,0,0,0.3) 0%, transparent 60%)",
            }} />
          </div>

          {/* Avatar */}
          <div style={{ padding: "0 2rem", marginTop: "-2.5rem", position: "relative", zIndex: 1 }}>
            <div style={{
              width: 72, height: 72,
              borderRadius: "50%",
              background: cfg.grad,
              border: "3px solid var(--bg)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              marginBottom: "1rem",
            }}>
              <User size={32} color="#fff" />
            </div>
            <h2 style={{ color: "var(--text-1)", fontWeight: 800, fontSize: "1.4rem", marginBottom: "0.25rem" }}>
              {profile.name}
            </h2>
            <span style={{
              display: "inline-block",
              padding: "0.2rem 0.75rem",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-2)",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              {cfg.label}
            </span>
          </div>

          {/* Details */}
          <div style={{ padding: "1.5rem 2rem 2rem" }}>
            {[
              { icon: Mail, label: "Email Address", value: profile.email },
              { icon: Shield, label: "Role", value: cfg.label },
              { icon: Calendar, label: "Member Since", value: new Date(profile.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}>
                <div style={{
                  width: 38, height: 38,
                  borderRadius: "10px",
                  background: "rgba(129,140,248,0.1)",
                  border: "1px solid rgba(129,140,248,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={17} color="#818cf8" />
                </div>
                <div>
                  <div style={{ color: "var(--text-3)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.15rem" }}>
                    {label}
                  </div>
                  <div style={{ color: "var(--text-1)", fontWeight: 600, fontSize: "0.9rem" }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Container>
  );
}

export default ProfilePage;
