import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { create } from "../../services/productService";
import { ProductContext } from "../../contexts/ProductContext";
import { Container, Row, Col, Card, Form, InputGroup, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { products, setProducts } = useContext(ProductContext); // Get products and setter
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("danger");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (evt) => {
    setMessage("");
    setErrors({ ...errors, [evt.target.name]: "" });
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const validateInputs = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (isNaN(formData.quantity) || parseInt(formData.quantity, 10) < 0) {
      newErrors.quantity = "Quantity must be a non-negative integer";
    }
    return newErrors;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const newErrors = validateInputs();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const price = parseFloat(formData.price);
      const quantity = parseInt(formData.quantity, 10);

      const response = await create({ name: formData.name, price, quantity });
      console.log("Response:", response);
      if (response) {
        const newProduct = { ...formData,image: response.image, price, quantity, _id: response._id };
        // alert the new product
        console.log("New Product:", newProduct);

        // **Update ProductContext & Local Storage**
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        localStorage.setItem("products", JSON.stringify(updatedProducts));

        setMessage("Product added successfully!");
        setMessageType("success");
        setTimeout(() => navigate("/"), 1000); // Redirect after 1.5 seconds
      } else {
        setMessage("Failed to add product");
        setMessageType("danger");
      }
    } catch (err) {
      setMessage(err.message);
      setMessageType("danger");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={12}>
          <Card className="shadow-lg mx-auto p-4" style={{ maxWidth: "500px" }}>
            <Card.Body>
              <h2 className="text-center mb-4">Create Product</h2>
              {message && <Alert variant={messageType}>{message}</Alert>}
              <Form autoComplete="off" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Product Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>📦</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      isInvalid={!!errors.name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      isInvalid={!!errors.price}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="quantity">
                  <Form.Label>Quantity</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>🔢</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Enter quantity"
                      min="0"
                      isInvalid={!!errors.quantity}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit">
                    Add Product
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

export default CreateProduct;