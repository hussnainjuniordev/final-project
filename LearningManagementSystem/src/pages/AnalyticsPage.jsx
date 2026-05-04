import { useEffect, useState } from 'react';
import { Alert, Container, Spinner, Table } from 'react-bootstrap';
import api from '../services/api.js';

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/analytics');
        setAnalytics(res.data);
      } catch {
        setError('Failed to load analytics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalEnrollments = analytics.reduce(
    (sum, row) => sum + (row.totalEnrollments || 0),
    0
  );

  return (
    <Container className="page-section py-5">
      <div className="section-heading mb-4">
        <p className="eyebrow mb-2">Admin</p>
        <h1 className="h2 fw-bold text-white mb-0">Analytics</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
          <p className="text-white-50 mt-3">Loading analytics...</p>
        </div>
      ) : analytics.length === 0 ? (
        <p className="text-white-50">No analytics data available.</p>
      ) : (
        <>
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Total Enrollments</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((row, idx) => (
                <tr key={row._id || idx}>
                  <td>{row.courseTitle || row.title || '—'}</td>
                  <td>{row.totalEnrollments ?? 0}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="fw-bold text-white">Total</td>
                <td className="fw-bold text-white">{totalEnrollments}</td>
              </tr>
            </tfoot>
          </Table>
        </>
      )}
    </Container>
  );
}

export default AnalyticsPage;
