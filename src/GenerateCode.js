import React, { useState } from 'react';

function GenerateCode({ code, paymentMethod, amount }) {
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Function to copy text to clipboard
  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setFeedbackMessage(`Code "${textToCopy}" copied to clipboard!`);
        setTimeout(() => setFeedbackMessage(''), 3000); // Clear feedback after 3 seconds
      },
      (err) => {
        setFeedbackMessage('Failed to copy code.');
        console.error('Failed to copy text: ', err);
      }
    );
  };

  return (
    <div className='code-container'>
      {paymentMethod === 'bizum' ? (
        <div className='steps'>
          <div className='step'>
            <p>
              <span>1</span> Envía un correo electrónico para hacer tu pedido:
            </p>
            <div>
              <div>
                <span>Dirección:</span>
                <code>pedidos@venite.es</code>
                <button onClick={() => copyToClipboard('pedidos@venite.es')} className='copy-button'>
                  Copy
                </button>
              </div>
              <div>
                <span>Asunto:</span>
                <code>Pedido Venite Bizum</code>
                <button onClick={() => copyToClipboard('Pedido Venite Bizum')} className='copy-button'>
                  Copy
                </button>
              </div>
              <div>
                <span>Mensaje:</span>
                <code>
                  Producto:<br />
                  Pez<br />
                  Nombre:<br />
                  ESCRIBE AQUÍ TU NOMBRE<br />
                  Dirección de entrega:<br />
                  ESCRIBE AQUÍ TU DIRECCIÓN COMPLETA<br />
                  Referencia de pago:<br />
                  {code}
                </code>
                <button onClick={() => copyToClipboard(code)} className='copy-button'>
                  Copy
                </button>
              </div>
            </div>
          </div>
          <div className='step'>
            <p>
              <span>2</span> Envía un bizum con tu referencia de pago para completar el pedido.
            </p>
            <div>
              <div>
                <span>Teléfono:</span>
                <code>+34600044026</code>
                <button onClick={() => copyToClipboard('+34600044026')} className='copy-button'>
                  Copy
                </button>
              </div>
              <div>
                <span>Importe:</span>
                <code>{amount}</code>
                <button onClick={() => copyToClipboard(amount)} className='copy-button'>
                  Copy
                </button>
              </div>
              <div>
                <span>Concepto:</span>
                <code>{code}</code>
                <button onClick={() => copyToClipboard(code)} className='copy-button'>
                  Copy
                </button>
              </div>
            </div>
          </div>
          <div className='step'>
            <p>
              <span>3</span> En unos días, recibirás un link de seguimiento de tu pedido.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <p>
              <span>1</span> Copia la referencia de pago
            </p>
            <div>
              <code>{code}</code>
              <button onClick={() => copyToClipboard(code)} className='copy-button'>
                Copy
              </button>
            </div>
          </div>
          <div>
            <p>
              <span>2</span> Envía un pago con tu referencia en el concepto al siguiente perfil:
              <a href='https://paypal.me/veniteadoremus?country.x=ES&locale.x=es_ES' target="_blank" rel='noopener noreferrer'>
                PayPal
              </a>
            </p>
          </div>
          <div>
            <p>
              <span>3</span> En unos días, recibirás un link de seguimiento de tu pedido.
            </p>
          </div>
        </div>
      )}

      {feedbackMessage && <p className='feedback-message'>{feedbackMessage}</p>}
    </div>
  );
}

export default GenerateCode;
