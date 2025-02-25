import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { signIn } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={12}> {/* Ensures full width for centering, with max-width control */}
          <Card className="shadow-lg mx-auto p-4" style={{ maxWidth: "500px" }}>
            <Card.Body>
              <h2 className="text-center mb-4">Sign In</h2>
              {message && <Alert variant="danger">{message}</Alert>}
              <Form autoComplete="off" onSubmit={handleSubmit}>
                
                {/* Username Input */}
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>@</InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={formData.username}
                      name="username"
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                {/* Password Input */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>🔒</InputGroup.Text>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      name="password"
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit">
                    Sign In
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/")}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignInForm;