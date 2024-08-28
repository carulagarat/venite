import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import GenerateCode from './GenerateCode';

// Function to generate a random 9-character alphanumeric code
const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 9; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function ProductPage({ productsData }) {
  const { id, lang } = useParams();
  const product = productsData.find(p => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showOptions, setShowOptions] = useState(false); // State to control the visibility of the options div
  const [activeInstruction, setActiveInstruction] = useState(''); // State to control which instruction is shown
  const [generatedCode, setGeneratedCode] = useState(''); // State to store the generated code
  const [paymentMethod, setPaymentMethod] = useState(''); // State to track the payment method

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (activeInstruction === 'paypal' || activeInstruction === 'bizum') {
      setGeneratedCode(generateRandomCode());
    }
  }, [activeInstruction]);

  if (!product) {
    return <p>{lang === 'es' ? '¡Producto no encontrado!' : 'Product not found!'}</p>;
  }

  return (
    <div className='productPage'>
      <div className='inner'>
        <div className='carouselHolder'>
          <Carousel
            showThumbs={true}
            dynamicHeight={false}
            infiniteLoop={true}
            autoPlay={false}
            interval={5000}
            swipeable={true}  // Enable swipe/drag
            emulateTouch={true} // Ensure touch dragging is enabled
          >
            {product.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </div>
            ))}
          </Carousel>
        </div>

        <div className='info'>
          <h1>{product.name}</h1>

          {selectedVariant ? (
            <div>
              <p className='dimensions'>
                <span>{selectedVariant.width}</span> x <span>{selectedVariant.height}</span> x <span>{selectedVariant.depth}</span> cm
              </p>
            </div>
          ) : (
            <div>
              <p className='dimensions'>
                <span>{product.width}</span> x <span>{product.height}</span> x <span>{product.depth}</span> cm
              </p>
            </div>
          )}

          <p className='desc'>{product.description}</p>

          {product.variants ? (
            <div className='bottom'>
              <div className='variants'>
                {product.variants.map(variant => (
                  <label key={variant.size} className='variant'>
                    <input
                      type="radio"
                      name="variant"
                      value={variant.size}
                      checked={selectedVariant?.size === variant.size}
                      onChange={() => setSelectedVariant(variant)}
                    />
                    <span>
                      {variant.size.charAt(0).toUpperCase() + variant.size.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              <p className='price'>{selectedVariant?.price.toFixed(2)}<span>€</span></p>
            </div>
          ) : (
            <p className='price'>{product.price.toFixed(2)}<span>€</span></p>
          )}

          <div className='purchase'>
            {showOptions ? null : 
            <button
            className='primary'
            onClick={() => setShowOptions(!showOptions)}
            >
              comprar
            </button>
            }

            {/* Conditional rendering of the options div based on showOptions state */}
            {showOptions && (
              <div className='options'>
                <button
                  className={`secondary ${activeInstruction === 'etsy' ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveInstruction('etsy');
                    setPaymentMethod(''); // Clear payment method for Etsy
                  }}
                >
                  comprar via etsy
                </button>
                <button
                  className={`secondary ${activeInstruction === 'paypal' ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveInstruction('paypal');
                    setPaymentMethod('paypal'); // Set payment method to PayPal
                  }}
                >
                  comprar via paypal
                </button>
                <button
                  className={`secondary ${activeInstruction === 'bizum' ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveInstruction('bizum');
                    setPaymentMethod('bizum'); // Set payment method to Bizum
                  }}
                >
                  comprar via bizum
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conditional rendering of the instructions divs */}
      {activeInstruction === 'etsy' && (
        <div className='instructions'>
          Etsy instructions
          Continue your purchase in Etsy
          <a className='button primary' href='https://www.etsy.com/listing/1590098951/pottery-apron-for-women-linen-apron-for?ref=search_srv-2&pro=1&sts=1&plkey=e4ca1f02c398378dda1edf5193ff5e0ae152b4c1%3A1590098951&variation0=3959190410'>
            go to Etsy listing
          </a>.
        </div>
      )}
      {(activeInstruction === 'paypal' || activeInstruction === 'bizum') && (
        <div className='instructions'>
          {paymentMethod} instructions
          <GenerateCode code={generatedCode} paymentMethod={paymentMethod} amount={product.variants ? selectedVariant?.price.toFixed(2) : product.price.toFixed(2)}/>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
