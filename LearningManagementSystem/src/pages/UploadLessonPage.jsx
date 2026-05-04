import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';
import * as courseService from '../services/courseService.js';
import * as lessonService from '../services/lessonService.js';

function UploadLessonPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getCourses();
        const myCourses = res.data.filter(
          (c) => c.instructor?._id === user?._id
        );
        setCourses(myCourses);
        if (myCourses.length > 0) {
          setCourseId(myCourses[0]._id);
        }
      } catch {
        setError('Failed to load your courses.');
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please select a video file.');
      return;
    }
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('courseId', courseId);
      formData.append('video', videoFile);
      await lessonService.createLesson(formData);
      setSuccess('Lesson uploaded successfully!');
      setTitle('');
      setVideoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to upload lesson. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="page-section py-5" style={{ maxWidth: '640px' }}>
      <div className="section-heading mb-4">
        <p className="eyebrow mb-1">Instructor</p>
        <h1 className="h2 fw-bold text-white mb-0">Upload Lesson</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="lessonTitle">
          <Form.Label className="text-white">Lesson Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Lesson title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="lessonCourse">
          <Form.Label className="text-white">Course</Form.Label>
          <Form.Select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            {courses.length === 0 && (
              <option value="">No courses available</option>
            )}
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4" controlId="lessonVideo">
          <Form.Label className="text-white">Video File</Form.Label>
          <Form.Control
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={(e) => setVideoFile(e.target.files[0] || null)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="light" disabled={uploading}>
          {uploading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Uploading...
            </>
          ) : (
            'Upload Lesson'
          )}
        </Button>
      </Form>
    </Container>
  );
}

export default UploadLessonPage;
