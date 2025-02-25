import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { create } from "../../services/orderService";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("danger");
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    address: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products"));
    const selectedProduct = products?.find((p) => p._id === productId);
    if (selectedProduct) {
      setProduct(selectedProduct);
    } else {
      setMessage("Product not found.");
      setMessageType("danger");
    }
    setLoading(false);
  }, [productId]);

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const orderResult = await create(productId);
      if (orderResult) {
        setOrderDetails({
          orderId: product._id, // Simulated order ID
          productName: product.name,
          price: product.price,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
        });
        setShowModal(true);
      }
    } catch (err) {
      setMessage(err.message);
      setMessageType("danger");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">Product not found.</Alert>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={12}>
          <Card className="shadow-lg mx-auto p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Checkout</h2>
              {message && <Alert variant={messageType}>{message}</Alert>}

              {/* Product Details */}
              <div className="text-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: "200px" }}
                />
                <h3>{product.name}</h3>
                <p className="text-muted">
                  Price: <strong>BHD {product.price}</strong>
                </p>
              </div>

              <Form autoComplete="off" onSubmit={handleSubmit}>
                {/* Delivery Address */}
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Delivery Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>📍</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter delivery address"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                {/* Phone Number */}
                <Form.Group className="mb-3" controlId="phoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>📞</InputGroup.Text>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                {/* Payment Details */}
                <h4 className="mt-4">Payment Details</h4>

                {/* Card Number */}
                <Form.Group className="mb-3" controlId="cardNumber">
                  <Form.Label>Card Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>💳</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="Enter 16-digit card number"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                {/* Expiry Date & CVV */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="expiryDate">
                      <Form.Label>Expiry Date</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>📅</InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="cvv">
                      <Form.Label>CVV</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>🔒</InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="3-digit CVV"
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit">
                    Complete Purchase
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

      {/* Success Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>🎉 Order Successful!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {orderDetails && (
            <>
              <h5>Order ID: {orderDetails.orderId}</h5>
              <p>
                <strong>Product:</strong> {orderDetails.productName}
              </p>
              <p>
                <strong>Price:</strong> BHD {orderDetails.price}
              </p>
              <p>
                <strong>Delivery Address:</strong> {orderDetails.address}
              </p>
              <p>
                <strong>Phone Number:</strong> {orderDetails.phoneNumber}
              </p>
              <p className="text-success">Your order has been placed successfully!</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Checkout;