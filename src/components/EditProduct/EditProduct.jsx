import { useState } from 'react';
import { useNavigate } from 'react-router';
import { create } from '../../services/productService';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';

const EditProduct = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const price = parseFloat(formData.price);
      if(!Number.isInteger(price)){
        throw new Error( 'Price must be an integer')
      }

      const quantity = parseFloat(formData.quantity);
      if(!Number.isInteger(quantity)){
        throw new Error( 'Quantity must be an integer')
      }

      await create ({ name: formData.name, price, quantity });
      throw new Error( 'Product added successfully')

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
            value={formData.name}
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
            value={formData.price}
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
            value={formData.quantity}
            onChange={handleChange}
            required
          />

        </InputGroup>

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit">Add Product</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
        </div>
      
        </form>
    </main>
  );
};

export default EditProduct;