import { useEffect, useState } from 'react';
import { Alert, Card, Container, Spinner } from 'react-bootstrap';
import * as userService from '../services/userService.js';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await userService.getProfile();
        setProfile(res.data);
      } catch {
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Container className="page-section py-5" style={{ maxWidth: '560px' }}>
      <div className="section-heading mb-4">
        <p className="eyebrow mb-2">Account</p>
        <h1 className="h2 fw-bold text-white mb-0">My Profile</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
          <p className="text-white-50 mt-3">Loading profile...</p>
        </div>
      ) : profile ? (
        <Card className="border-0 course-card shadow-sm">
          <Card.Body className="p-4">
            <dl className="mb-0">
              <dt className="text-white-50 small text-uppercase mb-1">Name</dt>
              <dd className="text-white fw-semibold fs-5 mb-3">{profile.name}</dd>

              <dt className="text-white-50 small text-uppercase mb-1">Email</dt>
              <dd className="text-white fw-semibold fs-5 mb-3">{profile.email}</dd>

              <dt className="text-white-50 small text-uppercase mb-1">Role</dt>
              <dd className="text-white fw-semibold fs-5 mb-0 text-capitalize">
                {profile.role}
              </dd>
            </dl>
          </Card.Body>
        </Card>
      ) : null}
    </Container>
  );
}

export default ProfilePage;
