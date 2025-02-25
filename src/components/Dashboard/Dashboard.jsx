import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { index } from '../../services/productService';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { UserContext } from '../../contexts/UserContext'
import { useContext } from 'react'

const Dashboard = () => {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  let isAdmin
	if (user) {
		const userType = user.userType;
		isAdmin = userType == 'admin'
	};

  const handleProductClick = (productId) => {
    if(isAdmin){
      navigate(`/edit-product/${productId}`);
    }else{
      alert(isAdmin)
      navigate(`/checkout/${productId}`);
    }
  };

  useEffect(() => {
    const fetchingProducts = async () => {
      setLoading(true);
      try {
        const cachedProducts = localStorage.getItem('products');
        if (cachedProducts) {
          setProductsList(JSON.parse(cachedProducts));
        } else {
          const fetchedProducts = await index();
          setProductsList(fetchedProducts);
          localStorage.setItem('products', JSON.stringify(fetchedProducts));
        }
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchingProducts();
  }, []);

  return (
    <main style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", padding: "20px" }}>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : productsList.length === 0 ? (
        <p>No products available</p>
      ) : (
        productsList.map((prdObj) => (
          <div key={prdObj._id} onClick={() => handleProductClick(prdObj._id)} style={{ cursor: "pointer" }}>
            <Card style={{ width: "14.4rem" }}>
              <Card.Img variant="top" src={prdObj.image} />
              <Card.Body>
                <Card.Title>{prdObj.name} - BHD {prdObj.price}</Card.Title>
                <Card.Text>{prdObj.description || "No description available."}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))
      )}
    </main>
  );
};

export default Dashboard;
