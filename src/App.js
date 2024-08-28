import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import ProductPage from './ProductPage';
import Home from './Home';
import About from './About';
import Cart from './Cart';
import CheckoutPage from './CheckoutPage'; // Import the new CheckoutPage component
import ConfirmationPage from './ConfirmationPage'; // Import the new ConfirmationPage component
import './App.css';

function App() {
  const [productsData, setProductsData] = useState([]);
  const [menuData, setMenuData] = useState({});
  const [cart, setCart] = useState([]);
  const [isFrameFixed, setIsFrameFixed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.split('/');
    const lang = path[1] === 'es' ? 'es' : 'en';

    fetch(`/locales/${lang}/products.json`)
      .then(response => response.json())
      .then(data => {
        setProductsData(data.catalog);
        setMenuData(data.menu[0]);
      })
      .catch(error => console.error('Error loading products data:', error));
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/en/');
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 260) {
        setIsFrameFixed(true);
      } else {
        setIsFrameFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to add or update product in the cart
  const addToCart = (product, selectedVariant, quantity) => {
    if (!product || !selectedVariant || quantity <= 0) {
      console.error("Invalid product, variant, or quantity:", product, selectedVariant, quantity);
      return;
    }
  
    setCart(prevCart => {
      console.log("Current cart:", prevCart);
  
      // Check if the item is already in the cart
      const existingItemIndex = prevCart.findIndex(item =>
        item.product.id === product.id && item.variant.size === selectedVariant.size
      );
  
      if (existingItemIndex >= 0) {
        console.log("Item already in cart, updating quantity.");
        // Update the quantity of the existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        console.log("Adding new item to cart.");
        // Add the new item to the cart
        return [...prevCart, { product, variant: selectedVariant, quantity }];
      }
    });
  };
  
  
  
  // Function to update quantity of an item in the cart
  const updateCartQuantity = (productId, variantSize, newQuantity) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => 
        item.product.id === productId && item.variant.size === variantSize
          ? { ...item, quantity: newQuantity }
          : item
      ).filter(item => item.quantity > 0);
      return updatedCart;
    });
  };

  // Function to remove item from the cart
  const removeFromCart = (productId, variantSize) => {
    setCart(prevCart => {
      return prevCart.filter(
        item => !(item.product.id === productId && item.variant.size === variantSize)
      );
    });
  };

  // Check if the URL is exactly /:lang/
  const isHomePage = /^\/(en|es)\/?$/.test(location.pathname);

  return (
    <div>
      {isHomePage ? null : <div className='trick'></div>}
      <NavBar menuData={menuData} cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />

      <div className={`frame ${isFrameFixed ? 'fixed' : ''}`}>
        <Routes>
          <Route path="/:lang" element={<Home productsData={productsData} menuData={menuData} />} />
          <Route 
            path="/:lang/product/:id" 
            element={<ProductPage productsData={productsData} addToCart={addToCart} />} 
          />
          <Route path="/:lang/about" element={<About />} />
          <Route 
            path="/:lang/cart" 
            element={<Cart cart={cart} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} />} 
          />
          <Route 
            path="/:lang/cart/checkout" 
            element={<CheckoutPage cart={cart} />} 
          />
          <Route 
            path="/:lang/checkout/confirmation" 
            element={<ConfirmationPage />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
