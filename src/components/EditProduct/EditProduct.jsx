import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { edit, getProduct } from '../../services/productService';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router';


const EditProduct = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [product, setProduct] = useState({
    name: '',
    price: '',
    quantity: '',
  });

  const { productId } = useParams();

  useEffect(() => {
    const fetchingProduct = async () => {
      try {
          const fetchedProduct = await getProduct(productId);
          setProduct(fetchedProduct);
      } catch (err) {
        console.error(err);
      }
    };

    fetchingProduct();
  }, []);

  
  const handleChange = (evt) => {
    setMessage('');
    setProduct({ ...product, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const price = parseFloat(product.price);
      if(!Number.isInteger(price)){
        throw new Error( 'Price must be an integer')
      }

      const quantity = parseFloat(product.quantity);
      if(!Number.isInteger(quantity)){
        throw new Error( 'Quantity must be an integer')
      }

      const formData = {
        name: product.name,
        price: price,
        quantity: quantity,
        productId: productId
      }

      await edit ( formData );
      navigate(`/`);
      throw new Error( 'Product edited successfully')
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main>
      <p>{message}</p>


      <form autoComplete='off' onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">Name</InputGroup.Text>
          <Form.Control
            type="text"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>$</InputGroup.Text>
          <Form.Control
            type="text"
            aria-label="Dollar amount (with dot and two decimal places)"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">Quantity</InputGroup.Text>
          <Form.Control
            type="text"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            id="quantity"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            required
          />

        </InputGroup>

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit">Edit Product</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
        </div>
      
        </form>
    </main>
  );
};

export default EditProduct;