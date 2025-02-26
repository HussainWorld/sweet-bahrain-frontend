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
          <div 
            key={prdObj._id} 
            onClick={() => handleProductClick(prdObj._id)} 
            style={{ cursor: "pointer" }}
          >
            <Card style={{ width: "16rem", height: "16rem", display: "flex", flexDirection: "column" }}>
              {}
              <Card.Img 
                variant="top" 
                src={prdObj.image} 
                style={{ width: "100%", height: "60%", objectFit: "cover" }} 
              />
              <Card.Body style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "12px" }}>
                <Card.Title style={{ width: "100%", fontSize: "16px", fontWeight: "bold", whiteSpace: "normal" }}>
                  {prdObj.name}
                </Card.Title>
                <Card.Title style={{ width: "100%", fontSize: "16px", fontWeight: "bold", whiteSpace: "normal" }}>
                  BHD {prdObj.price}
                </Card.Title>

                <Card.Text style={{ width: "100%", fontSize: "14px", whiteSpace: "normal", overflowWrap: "break-word" }}>
                  {prdObj.description || "No description available."}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))
      )}
    </main>
  );
};

export default Dashboard;

