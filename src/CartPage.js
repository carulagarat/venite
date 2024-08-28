import React, { useContext } from 'react';
import { CartContext } from './CartContext';

function CartPage() {
  const { cart, removeFromCart } = useContext(CartContext);

  const handleRemove = (index) => {
    removeFromCart(index);
  };

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className='cartPage'>
      <h1>Your Cart</h1>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            <h2>{item.name}</h2>
            <p>Size: {item.variant.size}</p>
            <p>Price: {item.variant.price.toFixed(2)}€</p>
            <button onClick={() => handleRemove(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: {cart.reduce((total, item) => total + item.variant.price, 0).toFixed(2)}€</p>
    </div>
  );
}

export default CartPage;
