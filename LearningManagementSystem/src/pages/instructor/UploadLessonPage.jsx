import { useEffect, useRef, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";
import * as courseService from "../../services/courseService.js";
import * as lessonService from "../../services/lessonService.js";

function UploadLessonPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getCourses();
        const myCourses = res.data.filter(
          (c) => c.instructor?._id === user?._id,
        );
        setCourses(myCourses);
        if (myCourses.length > 0) {
          setCourseId(myCourses[0]._id);
        }
      } catch (err) {
        toast.error("Failed to load your courses.");
      }
    };
    fetchCourses();
  }, [user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      toast.error("Please select a video file.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("courseId", courseId);
      formData.append("video", videoFile);
      await lessonService.createLesson(formData);
      toast.success("Lesson uploaded successfully!");
      setTitle("");
      setVideoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to upload lesson. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="page-section py-5" style={{ maxWidth: "640px" }}>
      <div className="section-heading mb-4">
        <span className="eyebrow mb-1">Instructor</span>
        <h1 className="h2 fw-bold mb-0" style={{ color: "var(--text-1)" }}>Upload Lesson</h1>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, #06b6d4, #10b981)",
        }} />
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="lessonTitle">
            <Form.Label>Lesson Title</Form.Label>
            <Form.Control type="text" placeholder="Lesson title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="lessonCourse">
            <Form.Label>Course</Form.Label>
            <Form.Select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
              {courses.length === 0 && <option value="">No courses available</option>}
              {courses.map((c) => (<option key={c._id} value={c._id}>{c.title}</option>))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-4" controlId="lessonVideo">
            <Form.Label>Video File</Form.Label>
            <Form.Control type="file" accept="video/*" ref={fileInputRef} onChange={(e) => setVideoFile(e.target.files[0] || null)} required />
            <div style={{ color: "var(--text-3)", fontSize: "0.78rem", marginTop: "0.5rem" }}>
              Supported formats: MP4, MOV, AVI, WebM (max 200MB)
            </div>
          </Form.Group>
          <Button type="submit" variant="light" disabled={uploading}>
            {uploading ? (<><Spinner animation="border" size="sm" className="me-2" />Uploading...</>) : "Upload Lesson"}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default UploadLessonPage;
