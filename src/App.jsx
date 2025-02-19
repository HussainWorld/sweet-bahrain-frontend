import { Routes, Route, useLocation } from 'react-router'
import { useContext, useEffect } from 'react'
import NavBar from './components/NavBar/NavBar'
import SignUpForm from './components/SignUpForm/SignUpForm'
import Landing from './components/Landing/Landing'
import SignInForm from './components/SignInForm/SignInForm'
import Dashboard from './components/Dashboard/Dashboard'

import { UserContext } from './contexts/UserContext'
import './App.css';

const App = () => {

  const { user } = useContext(UserContext)
  const location = useLocation();

  useEffect(() => {
    const body = document.body;

    //remove previous classes
    body.classList.remove('landing-bg', 'signin-bg', 'singup-bg');

    //add the class based on the current route
    if (location.pathname === '/') {
      body.classList.add('landing-bg');
    } else if (location.pathname === '/sign-in') {
      body.classList.add('signin-bg')
    } else if (location.pathname === '/sign-up') {
      body.classList.add('signup-bg')
    }

  }, [location.pathname]);

  return (
    <>
      <NavBar />
      <Routes>
        {/* if user exists show dashboard otherwise show landing page */}
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path='/sign-up' element={<SignUpForm />} />
      </Routes>
    </>
  );
};

export default App