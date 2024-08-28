import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan  } from '@fortawesome/free-regular-svg-icons';
import Back from './Back';

function Cart({ cart, updateCartQuantity, removeFromCart }) {
  const navigate = useNavigate();

  // Handle the removal of an item from the cart
  const handleRemove = (productId, variantSize) => {
    removeFromCart(productId, variantSize);
  };

  // Handle the quantity update of an item in the cart
  const handleQuantityChange = (productId, variantSize, event) => {
    const newQuantity = Number(event.target.value);
    updateCartQuantity(productId, variantSize, newQuantity);
  };

  // Calculate total price
  const totalPrice = cart.reduce((acc, item) => acc + (item.variant.price * item.quantity), 0);

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="page thin">
      <Back />
      <h1>Cart</h1>
      <div className='items'>
        {cart.map(item => (
          <div key={`${item.product.id}-${item.variant.size}`} className="cart-item row middle">
            <h3 className='title'>
              {item.product.name}
              <span>{item.variant.size !== "default" && `(${item.variant.size})`}</span>
            </h3>
            <div className='row middle'>
              <span>{item.variant.price.toFixed(2)} <span className='caption'>€</span></span>
              <span className='caption inline'><span>x</span></span>
              <input
                className="quantity"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.product.id, item.variant.size, e)}
              />
            </div>
            <div className='row middle'>
              <span className='price small'>{(item.variant.price * item.quantity).toFixed(2)}<span>€</span></span>
              <button className='remove' onClick={() => handleRemove(item.product.id, item.variant.size)}>
              <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className='total column right'>
        <span className='price'><span className='from'>Total: </span>{totalPrice.toFixed(2)}<span>€</span></span>
        <span className='caption'>No incluye transporte</span>
      </div>
      <div className='stepNav'>
        <div></div>

        <button className='secondary' onClick={() => navigate(`/en/cart/checkout`)}>Next</button>
      </div>
    </div>
  );
}

export default Cart;
