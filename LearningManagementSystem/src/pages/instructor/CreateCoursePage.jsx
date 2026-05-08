import { useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as courseService from "../../services/courseService.js";

function CreateCoursePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await courseService.createCourse({
        title,
        description,
        category,
        price: Number(price),
      });
      toast.success("Course created successfully!");
      navigate("/dashboard/instructor/courses");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to create course. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="page-section py-5" style={{ maxWidth: "640px" }}>
      <div className="section-heading mb-4">
        <span className="eyebrow mb-1">Instructor</span>
        <h1 className="h2 fw-bold mb-0" style={{ color: "var(--text-1)" }}>Create New Course</h1>
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
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
        }} />
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="courseTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Course title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="courseDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Course description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="courseCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" placeholder="e.g. Web Development" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-4" controlId="coursePrice">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
          </Form.Group>
          <Button type="submit" variant="light" disabled={loading}>
            {loading ? (<><Spinner animation="border" size="sm" className="me-2" />Creating...</>) : "Create Course"}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default CreateCoursePage;
