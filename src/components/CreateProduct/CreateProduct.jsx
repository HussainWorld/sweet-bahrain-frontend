import { useState } from 'react';
import { useNavigate } from 'react-router';

import { create } from '../../services/productService'

const CreateProduct = () => {
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
      <h1>{message}</h1>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>Name:</label>
          <input
            type='text'
            autoComplete='off'
            id='name'
            value={formData.name}
            name='name'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='price'>Price:</label>
          <input
            type='text'
            autoComplete='off'
            id='price'
            value={formData.price}
            name='price'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='quantity'>Quantity:</label>
          <input
            type='text'
            autoComplete='off'
            id='quantity'
            value={formData.quantity}
            name='quantity'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button>Add Products</button>
          <button onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default CreateProduct;