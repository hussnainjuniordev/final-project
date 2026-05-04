import { useState } from 'react';
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as courseService from '../services/courseService.js';

function CreateCoursePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await courseService.createCourse({ title, description, category, price: Number(price) });
      navigate('/dashboard/instructor/courses');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create course. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="page-section py-5" style={{ maxWidth: '640px' }}>
      <div className="section-heading mb-4">
        <p className="eyebrow mb-1">Instructor</p>
        <h1 className="h2 fw-bold text-white mb-0">Create New Course</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="courseTitle">
          <Form.Label className="text-white">Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="courseDescription">
          <Form.Label className="text-white">Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Course description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="courseCategory">
          <Form.Label className="text-white">Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Web Development"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="coursePrice">
          <Form.Label className="text-white">Price ($)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="light" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Creating...
            </>
          ) : (
            'Create Course'
          )}
        </Button>
      </Form>
    </Container>
  );
}

export default CreateCoursePage;
