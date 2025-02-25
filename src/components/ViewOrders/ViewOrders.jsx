import { useEffect, useState } from 'react';
import { Container, Card, CardGroup, Spinner, Alert } from 'react-bootstrap';
import { getOrders } from '../../services/orderService';

const ViewOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchedOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrders();
        setOrdersList(data);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchedOrders();
  }, []);
  console.log(ordersList[1])
  return (
    <Container className="mt-4">
    <h2 className="text-center mb-4">Orders</h2>

    {loading && <Spinner animation="border" className="d-block mx-auto" />}
    {error && <Alert variant="danger">{error}</Alert>}

    <div className="d-flex flex-wrap justify-content-center gap-3">
      {ordersList.length > 0 ? (
        ordersList.map((order) => (
          <Card key={order._id} style={{ width: '300px' }} className="shadow-sm">
            <Card.Body>
              <Card.Title>Order ID: {order._id}</Card.Title>
              <Card.Text>
                <strong>Total Price:</strong> ${order?.product.price?.toFixed(2) || 'N/A'}            
                <br />
                <strong>Date:</strong> {order?.orderDate}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
            <strong>Status:</strong> {order?.status}
            </Card.Footer>
          </Card>
        ))
      ) : (
        !loading && <p className="text-center">No orders found.</p>
      )}
    </div>
  </Container>
  );
};

export default ViewOrders;