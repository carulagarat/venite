import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function Home({ productsData, menuData }) {
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFixed, setIsFixed] = useState(false); // State to track if the filters should be fixed
  const { lang } = useParams();

  const tags = [...new Set(productsData.flatMap(product => product.tags || []))];

  const filteredProducts = productsData.filter(product => {
    const matchesTag = selectedTag ? product.tags && product.tags.includes(selectedTag) : true;
    const matchesSearch = searchQuery 
      ? product.name.toLowerCase().includes(searchQuery) || 
        product.description.toLowerCase().includes(searchQuery) || 
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
      : true;
    return matchesTag && matchesSearch;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 260) {
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

  return (
    <div className='page center'>
      <h1>{menuData.home}</h1>
      
      <div className={`filters ${isFixed ? 'fixed' : ''}`}>
        <div className='filters-inner'>
          <div className='tags'>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => selectedTag === tag ? setSelectedTag(null) : setSelectedTag(tag)}
                className={selectedTag === tag ? 'tag selected' : 'tag'}
                style={{ marginRight: '5px' }}
              >
                {tag}
              </button>
            ))}
            {selectedTag === null || <button onClick={() => setSelectedTag(null)} className="tag close">x</button>}
          </div>

          <div className="search-container" style={{ position: 'relative', display: 'inline-block' }}>
            <input 
              type="text" 
              placeholder={menuData.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              style={{ padding: '5px', paddingRight: '25px' }} // Reserve space for the clear button
            />
            {searchQuery && (
              <button 
                className="clear-button" 
                onClick={() => setSearchQuery('')} 
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#999'
                }}
              >
                x
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Rendering for No Results */}
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <Link to={`/${lang}/product/${product.id}`}>
                <div className="card-images">
                  {(product.images && Array.isArray(product.images)) ? (
                    product.images.slice(0, 2).map((image, index) => (
                      <img key={index} src={image} alt={`${product.name} ${index + 1}`} className="card-thumbnail" />
                    ))
                  ) : (
                    <p>{menuData.noResults}</p>
                  )}
                </div>
                <div className='card-info'>
                    <h2>{product.name}</h2>
                    <p className='desc'>{product.description}</p>
                    {product.variants && Array.isArray(product.variants)
                        ? <p className='price'><span className='from'>From</span>{Math.min(...product.variants.map(variant => variant.price)).toFixed(2)}<span>€</span></p>
                        : <p className='price'>{product.price}<span>€</span></p>}
                    
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>{menuData.noResults}</p>
      )}
    </div>
  );
}

export default Home;
