import { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import { getOrders } from '../../services/orderService';
import { getProduct } from '../../services/productService';

// import { getUser } from '../../services/userService';

const ViewOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productDetails, setProductDetails] = useState({});

  // const [ userDetails , setUserDetails ] = useState({})

  useEffect(() => {
    const fetchOrdersAndProductsAndUsers = async () => {
      setLoading(true);
      try {
        
        const ordersData = await getOrders();
        setOrdersList(ordersData);
        
        const productsInfo = {};
        // const usersInfo = {};

        for (const order of ordersData) {
          const productData = await getProduct(order.product);
          productsInfo[order.product] = productData;

          // if (order.user && !usersInfo[order.user]){
          //   usersInfo[order.user] = await getUser(order.user)
          // }
        }
        setProductDetails(productsInfo);
        // setUserDetails(usersInfo);


      } catch (err) {
        setError('Failed to load orders. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndProductsAndUsers();
  }, []);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    return formattedDate;
  };

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
              <Card.Title>
                  {productDetails[order.product]?.image && (
                    <img
                      src={productDetails[order.product]?.image}
                      alt={order._id}
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                  )}
                </Card.Title>
                <Card.Text>
                  <strong>{productDetails[order.product]?.name}</strong>
                  <br />
                  <strong>Total Price:</strong> BHD:
                  {productDetails[order.product]?.price}
                  <br />
                  <strong>Date:</strong> {order?.orderDate ? formatDate(order?.orderDate) : 'N/A'}
                  <br />
                  {/* <strong>Ordered by:</strong> {userDetails[order.user]?.name || 'Unknown'} */}
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