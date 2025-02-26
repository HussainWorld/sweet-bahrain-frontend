import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { edit, getProduct } from "../../services/productService";
import { ProductContext } from "../../contexts/ProductContext";
import { Container, Row, Col, Card, Form, InputGroup, Button, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products, setProducts } = useContext(ProductContext); // Context for real-time updates

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("danger");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    const fetchingProduct = async () => {
      setLoading(true);
      try {
        const fetchedProduct = await getProduct(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          throw new Error("Product not found");
        }
      } catch (err) {
        setMessage(err.message);
        setMessageType("danger");
      } finally {
        setLoading(false);
      }
    };

    fetchingProduct();
  }, [productId]);

  const handleChange = (evt) => {
    setMessage("");
    setErrors({ ...errors, [evt.target.name]: "" }); // Clear errors when user types
    setProduct({ ...product, [evt.target.name]: evt.target.value });
  };

  const validateInputs = () => {
    let newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (isNaN(product.price) || parseFloat(product.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (isNaN(product.quantity) || parseInt(product.quantity, 10) < 0) {
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
      const price = parseFloat(product.price);
      const quantity = parseInt(product.quantity, 10);

      const formData = {
        name: product.name,
        price: price,
        quantity: quantity,
        productId: productId,
      };

      await edit(formData);

      // ✅ Update Product Context for Real-Time UI Update
      const updatedProducts = products.map((p) =>
        p._id === productId ? { ...p, ...formData } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      setMessage("Product updated successfully!");
      setMessageType("success");

      setTimeout(() => navigate("/"), 1500); // Redirect after 1.5 seconds

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
              <h2 className="text-center mb-4">Edit Product</h2>

              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
                  {message && <Alert variant={messageType}>{message}</Alert>}
                  <Form autoComplete="off" onSubmit={handleSubmit}>
                    {/* Product Name Input */}
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Product Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>📦</InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="name"
                          value={product.name}
                          onChange={handleChange}
                          placeholder="Enter product name"
                          isInvalid={!!errors.name}
                          required
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    {/* Price Input */}
                    <Form.Group className="mb-3" controlId="price">
                      <Form.Label>Price</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          name="price"
                          value={product.price}
                          onChange={handleChange}
                          placeholder="Enter price"
                          isInvalid={!!errors.price}
                          required
                        />
                        <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    {/* Quantity Input */}
                    <Form.Group className="mb-3" controlId="quantity">
                      <Form.Label>Quantity</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>🔢</InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="quantity"
                          value={product.quantity}
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
                        Save Changes
                      </Button>
                      <Button variant="secondary" onClick={() => navigate("/")}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProduct;