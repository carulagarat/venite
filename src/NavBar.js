import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';

function NavBar({ menuData, cartItemCount }) {
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [isFixed, setIsFixed] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // State to manage the 'update' class

  const pathParts = location.pathname.split('/');
  const currentLang = pathParts[1];
  const toggleLang = currentLang === 'en' ? 'es' : 'en';
  const newPath = location.pathname.replace(`/${currentLang}/`, `/${toggleLang}/`);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (cartItemCount > 0) {
      setIsUpdated(true);
      const timer = setTimeout(() => {
        setIsUpdated(false);
      }, 300); // Remove 'update' class after 300ms

      return () => clearTimeout(timer); // Clean up the timer if the component unmounts
    }
  }, [cartItemCount]); // Run this effect whenever cartItemCount changes

  return (
    <header className={isFixed ? 'fixed' : ''}>
      <nav>
        <NavLink to={`/${menuData.lang}/`} className='logo-link'>
          <img src='/imgs/venite-logo.svg' className='logo' alt="Logo" />
        </NavLink>
        <div className='links'>
          <NavLink to={`/${menuData.lang}/`}>{menuData.home}</NavLink>
          <NavLink to={`/${menuData.lang}/about`}>{menuData.contact}</NavLink>
          
          <span className='fixedIcons'>
            <button onClick={() => navigate(newPath)}>
              {menuData.lang}
            </button>

            <NavLink to={`/${menuData.lang}/cart`} className={`cart ${cartItemCount > 0 ? 'full' : ''}`}>
              <FontAwesomeIcon icon={faBasketShopping} />
              {cartItemCount > 0 ? (
                <span className={`cartCounter ${isUpdated ? 'update' : ''}`}>
                  {cartItemCount}
                </span> 
              ) : null}
            </NavLink>
          </span>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
