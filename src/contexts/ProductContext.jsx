import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const ProductContext = createContext();

const getProductsFromLocalStorage = () => {
    const products = localStorage.getItem('products');
    if (!products) return [];

    return JSON.parse(products);
};

function ProductProvider({ children }) {
    const [products, setProducts] = useState(getProductsFromLocalStorage());

    const value = { products, setProducts };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

ProductProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { ProductProvider, ProductContext };