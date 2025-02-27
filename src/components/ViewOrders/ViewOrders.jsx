import { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import { getOrders } from '../../services/orderService';
import { getProduct } from '../../services/productService';

const ViewOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const ordersData = await getOrders();
        if (!ordersData || ordersData.length === 0) {
          setOrdersList([]);
          setLoading(false);
          return;
        }
        setOrdersList(ordersData);

        const productPromises = ordersData.map((order) =>
          getProduct(order.product).catch(() => null)
        );
        const productsData = await Promise.all(productPromises);

        const productsInfo = {};
        ordersData.forEach((order, index) => {
          if (productsData[index]) {
            productsInfo[order.product] = productsData[index];
          }
        });

        setProductDetails(productsInfo);
      } catch (err) {
        setError(`Failed to load orders. Please try again. Error: ${err.message}`);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndProducts();
  }, []);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Orders</h2>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex flex-wrap justify-content-center gap-3">
        {ordersList.length > 0 ? (
          ordersList.map((order) => {
            const product = productDetails[order.product];

            return (
              <Card key={order._id} style={{ width: '300px' }} className="shadow-sm">
                <Card.Body>
                  <Card.Title>
                    {product?.image && (
                      <img
                        src={product.image}
                        alt={product.name || 'Product'}
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                      />
                    )}
                  </Card.Title>
                  <Card.Text>
                    <strong>{product?.name || 'Unknown Product'}</strong>
                    <br />
                    <strong>Total Price:</strong> BHD {product?.price || 'N/A'}
                    <br />
                    <strong>Date:</strong> {order?.orderDate ? formatDate(order.orderDate) : 'N/A'}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <strong>Status:</strong> {order?.status || 'Unkown'}
                </Card.Footer>
              </Card>
            );
          })
        ) : (
          !loading && <p className="text-center">No orders found.</p>
        )}
      </div>
    </Container>
  );
};

export default ViewOrders;