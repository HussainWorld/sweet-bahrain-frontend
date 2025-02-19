import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { create } from '../../services/orderService'

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    address: '',
    phoneNumber: ''
  });

  const { cardNumber, expiryDate, cvv, address, phoneNumber } = formData;

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products'));
    const selectedProduct = products.find(p => p._id === productId);
    setProduct(selectedProduct);
  }, [productId]);

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    try {
      const orderResult = await create(productId)
      if (orderResult) {
        setShowModal(true)
      }
    } catch (err) {
      setMessage(err.message)
    }
  }
  
  const isFormInvalid = () => {
    return !(cardNumber && expiryDate && cvv && address && phoneNumber);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };
  if (!product) return <div>Loading...</div>;

  return (
    <main>
      <h1>Checkout</h1>
      <div className="product-details">
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
        <p>Price: BHD {product.price}</p>
      </div>

      <div className="customer-info">
      </div>

      <p>{message}</p>

      <div className="payment-section">
        <h3>Customer Details</h3>
        <p>Name: {user?.username}</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="address">Delivery Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <h3>Payment Details</h3>
          <div>
            <label htmlFor="cardNumber">Card Number:</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={cardNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="expiryDate">Expiry Date:</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="cvv">CVV:</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={cvv}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <button type="submit" disabled={isFormInvalid()}>Complete Purchase</button>
            <button type="button" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Order Successful!</h2>
            <p>Thank you for your purchase.</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;