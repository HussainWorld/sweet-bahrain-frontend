import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
// import { ProductContext } from '../../contexts/ProductContext';
import { useNavigate } from 'react-router';
import * as productService from '../../services/productService'

const Dashboard = () => {
  const { user } = useContext(UserContext);
  // const { product } = useContext(ProductContext);
  const [productsList, setProductsList] = useState([]);
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/checkout/${productId}`);
  };

  useEffect(() => {
    const fetchingProducts = async () => {
      try {
        const fetchedProducts = await productService.index()
        setProductsList(fetchedProducts)
        localStorage.setItem('products', JSON.stringify(fetchedProducts))
      } catch (err) {
        console.log(err)
      }
    }
    
    fetchingProducts()
  }, [])

  return (
    <main>
      <h1>Welcome, {user?.username}</h1>
      <h1>SWEET BAHRAIN</h1>
      
      {productsList.map((prdObj) => (
        <div 
          key={prdObj._id} 
          onClick={() => handleProductClick(prdObj._id)}
          style={{ cursor: 'pointer' }}
        >
          <img src={prdObj.image} alt={prdObj.name} />
          <h4>{prdObj.name} BHD {prdObj.price}</h4>
        </div>
      ))}
    </main>
  );
};

export default Dashboard