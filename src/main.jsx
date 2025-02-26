import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { UserProvider } from './contexts/UserContext.jsx'
import { ProductProvider } from "./contexts/ProductContext.jsx"; // ✅ Import ProductProvider
import './index.css'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap' 
import 'bootstrap-icons/font/bootstrap-icons.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <UserProvider>
        <ProductProvider> {/* ✅ Wrap App inside ProductProvider */}
          <App />
        </ProductProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
