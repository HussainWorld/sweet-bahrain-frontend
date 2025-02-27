import { Routes, Route } from 'react-router';
import { useContext } from 'react';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import HomePage from './components/HomePage/HomePage';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './components/Dashboard/Dashboard';
import Checkout from './components/Checkout/Checkout';
import EditProduct from './components/EditProduct/EditProduct';
import AdminDashboard from './components/CreateProduct/CreateProduct'
import ViewOrders from './components/ViewOrders/ViewOrders'
import CreateProduct from './components/CreateProduct/CreateProduct'
import { UserContext } from './contexts/UserContext';
import './App.css';

const App = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <HomePage />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/checkout/:productId" element={<Checkout />} />
        <Route path="/edit-product/:productId" element={<EditProduct />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/orders" element={<ViewOrders />} />
        <Route path="/create-product" element={<CreateProduct />} />
      </Routes>
    </>
  );
};

export default App;