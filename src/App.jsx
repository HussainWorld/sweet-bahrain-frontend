import { Routes, Route, useLocation } from 'react-router';
import { useContext, useEffect } from 'react';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import Landing from './components/Landing/Landing';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './components/Dashboard/Dashboard';
import Checkout from './components/Checkout/Checkout';
import AdminDashboard from './components/CreateProduct/CreateProduct'
import { UserContext } from './contexts/UserContext';
import './App.css';

const App = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    const body = document.body;

    // Remove previous classes
    body.classList.remove('landing-bg', 'signin-bg', 'signup-bg', 'dashboard-bg');

    // Add the class based on the current route and auth state
    if (user) {
      body.classList.add('dashboard-bg');
    } else if (location.pathname === '/') {
      body.classList.add('landing-bg');
    } else if (location.pathname === '/sign-in') {
      body.classList.add('signin-bg');
    } else if (location.pathname === '/sign-up') {
      body.classList.add('signup-bg');
    }
  }, [location.pathname, user]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/checkout/:productId" element={<Checkout />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};

export default App;