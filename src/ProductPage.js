import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Back from './Back';

function ProductPage({ productsData, addToCart }) {
  const { id, lang } = useParams();
  const product = productsData.find(p => p.id === id);

  const navigate = useNavigate();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Update selectedVariant when product changes
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null); // Explicitly set to null if there are no variants
    }
  }, [product]);
  
  if (!product) {
    return <p>{lang === 'es' ? '¡Producto no encontrado!' : 'Product not found!'}</p>;
  }

  // Fallback to a default value if price is undefined
  const variantPrice = selectedVariant?.price ?? product.price ?? 0;
  const totalPrice = variantPrice * quantity;

  const handleAddToCart = () => {
    // Check if the product has variants
    if (product) {
      if (product.variants && selectedVariant) {
        // If there are variants and one is selected, add to cart with the selected variant
        addToCart(product, selectedVariant, quantity);
      } else {
        // If there are no variants, add the product without a variant
        addToCart(product, { size: "default", price: product.price }, quantity);
      }
  
      // Reset quantity to 1 after adding to cart
      setQuantity(1);
    }
  };
  
  return (
    <div className='page'>
      <Back />

      <div className='row'>
        <div className='carouselHolder'>
          <Carousel
            showThumbs={true}
            infiniteLoop={true}
            swipeable={true}
            emulateTouch={true}
          >
            {product.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </div>
            ))}
          </Carousel>
        </div>

        <div className='product-info column'>
          <h1>{product.name}</h1>

          <p className='caption'>
            <span>{selectedVariant?.width || product.width}</span>
            <span>x</span>
            <span>{selectedVariant?.height || product.height}</span>
            <span>x</span>
            <span>{selectedVariant?.depth || product.depth}</span>
            <span>cm</span>
          </p>

          <p className='desc'>{product.description}</p>

          {product.variants && (
            <div className='row wrap'>
              {product.variants.map(variant => (
                <label key={variant.size} className='variant'>
                  <input
                    type="radio"
                    name="variant"
                    value={variant.size}
                    checked={selectedVariant?.size === variant.size}
                    onChange={() => setSelectedVariant(variant)}
                  />
                  <span>{variant.size.charAt(0).toUpperCase() + variant.size.slice(1)}</span>
                </label>
              ))}
            </div>
          )}

          <div>
            
            <div className='row middle'>
              <span className='price small'>
                {variantPrice.toFixed(2)}<span>€</span>
              </span>
              <span className='caption inline'>x</span>
              <input
                className='quantity'
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className='total'>
              <span className='price'><span className='from'>Total: </span>{totalPrice.toFixed(2)}<span>€</span></span>
              <button className='primary' onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
