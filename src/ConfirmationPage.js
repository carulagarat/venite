import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { faMobileScreenButton, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faClone } from '@fortawesome/free-regular-svg-icons';

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract state from location
  const state = location.state || {};
  const { totalPrice, address } = state;

  const [generatedCode, setGeneratedCode] = useState('');
  const [copyButtonText, setCopyButtonText] = useState(
    <>
      <FontAwesomeIcon icon={faClone} /> Copy all
    </>
  );

  // Generate a 9-character code when the component mounts
  useEffect(() => {
    const generateCode = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }
      return code;
    };

    setGeneratedCode(generateCode());
  }, []);

  const handleCopy = () => {
    const textToCopy = document.querySelector('.code').innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyButtonText(
        <>
          <FontAwesomeIcon icon={faCheck} /> Copied!
        </>
      );
      setTimeout(() => {
        setCopyButtonText(
          <>
            <FontAwesomeIcon icon={faClone} /> Copy all
          </>
        );
      }, 1200);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  if (!totalPrice || !address) {
    return <p>No data available.</p>;
  }

  return (
    <div className="page thin">
      <h1>Place your order</h1>

      <div className='instructions row'>
        <div className='column'>
          <p className='step column'>
            <span>Step 1</span>
            Copia el texto de la derecha
          </p>
          <p className='step column'>
            <span>Step 2</span>
            Pégalo en un nuevo correo electrónico
          </p>
          <p className='step column'>
            <span>Step 3</span>
             Envíalo a <a href='mailto:pedidos@venite.es?subject=Pedido%20Venite' rel='noopener noreferrer'>pedidos@venite.es</a> con asunto 'Pedido Venite'
          </p>
          
        </div>
        <div className='column'>
          <div className='codeWrapper'>
            <code className='code'>
              Recipient:<br />
              {address.name} {address.surname}<br />
              <br />
              Shipping Address:<br />
              {address.street}, {address.moreAddress}<br />
              {address.postalCode} - {address.city}<br />
              {address.province}, {address.country}<br />
              <br />
              Total Price:<br />
              {totalPrice.toFixed(2)} €<br />
              <br />
              Your Code:<br />
              {generatedCode}
            </code>
            <button className='copyCode' onClick={handleCopy}>
              {copyButtonText}
            </button>
          </div>

        </div>
      </div>
          
      <div className='total'>
      </div>

      <div className='stepNav'>
        <button className='secondary' onClick={() => navigate(-1, { state: { address } })}>Back</button>
        <div className='row'>
          <button className='primary' type="submit">
            <FontAwesomeIcon icon={faPaypal} />
            Paypal
          </button>
          <button className='primary' type="submit">
            <FontAwesomeIcon icon={faMobileScreenButton} />
            Bizum
          </button>
        </div>
      </div>

    </div>
  );
}

export default ConfirmationPage;
