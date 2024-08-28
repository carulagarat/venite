import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CheckoutPage({ cart }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Load address from localStorage or initialize it to default values
  const [address, setAddress] = useState(() => {
    const savedAddress = localStorage.getItem('checkoutAddress');
    return savedAddress ? JSON.parse(savedAddress) : {
      name: '',
      surname: '',
      street: '',
      moreAddress: '',
      postalCode: '',
      city: '',
      province: '',
      country: ''
    };
  });

  // Save address to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkoutAddress', JSON.stringify(address));
  }, [address]);

  // Calculate total price
  const totalPrice = cart.reduce((acc, item) => acc + (item.variant.price * item.quantity), 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/en/checkout/confirmation', {
      state: { totalPrice, address } // Pass the address data to the confirmation page
    });
  };

  return (
    <div className="page thin">
      <h1>Personal information</h1>

      <form onSubmit={handleSubmit}>
        <div className='row wrap'>
          <div className='field column'>
            <input 
              type="text" 
              placeholder=" " 
              value={address.name} 
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              />
              <label><span>Name</span></label>
          </div>
          <div className='field column'>
            <input 
              type="text" 
              placeholder=" " 
              value={address.surname} 
              onChange={(e) => setAddress({ ...address, surname: e.target.value })}
              />
              <label><span>Surname</span></label>
          </div>
          <div className='field column'>
            <input 
              type="text" 
              placeholder=" " 
              value={address.street} 
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
              <label><span>Street</span></label>
          </div>
          <div className='field column'>
            <input 
              type="text" 
              placeholder=" " 
              value={address.moreAddress} 
              onChange={(e) => setAddress({ ...address, moreAddress: e.target.value })}
              />
              <label><span>More Address</span></label>
          </div>
          <div className='field column'>
            <input 
              type="text" 
              placeholder=" " 
              value={address.postalCode} 
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              />
              <label><span>Postal Code</span></label>
          </div>
          <div className='field column'>
            <input 
              type="text" 
              placeholder=" " 
              value={address.city} 
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <label><span>City</span></label>
          </div>
          <div className='field column'>
            <input 
              type="text" 
              placeholder=" " 
              value={address.province} 
              onChange={(e) => setAddress({ ...address, province: e.target.value })}
              />
              <label><span>Province</span></label>
          </div>
          <div className='field column'>
            <input 
              type="text" 
              placeholder=" " 
              value={address.country} 
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              />
              <label><span>Country</span></label>
          </div>
        </div>

        <div className='total column right'>
          <p className='price'><span className='from'>Total:</span>{totalPrice.toFixed(2)}<span>€</span></p>
          <span className='caption'>No incluye transporte</span>
        </div>

        <div className='stepNav'>
          <button 
            className='secondary' 
            onClick={() => navigate(-1, { state: { totalPrice, address } })} // Pass the state back when navigating
          >
            Back
          </button>
          <button className='secondary' type="submit">Next</button>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
