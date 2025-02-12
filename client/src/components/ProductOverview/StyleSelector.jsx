import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import brokenImage from '../../images/placeholder.jpeg';

const StyleSelector = ({ selectedStyle, setSelectedStyle, selectedSize, setSelectedSize, quantity, setQuantity, selectedImageIndex, setSelectedImageIndex }) => {

  const id = useSelector(state => state.products.currentProduct) || 40347;
  const styles = useSelector(state => state.products.productStyles?.[id]?.results) || [];
  const status = useSelector(state => state.products.status);


  if (status === 'loading') return <div>Loading styles...</div>;

  return (
    <div className='style-section'>
      <p className='style-label'>
        <strong>Style -</strong> {selectedStyle?.name}
      </p>
      <div className='style-options'>
        {styles?.length && styles.map(style => (
          <div
            key={style?.style_id}
            className={`style-option ${selectedStyle?.style_id === style?.style_id ? 'selected' : ''}`}
            onClick={(() => {
              setSelectedStyle(style);
              setSelectedSize('');
              setQuantity(1);
              setSelectedImageIndex(0);
            })}
          >
            {selectedStyle?.style_id === style.style_id && <span className="checkmark"><i className="fa-solid fa-check"></i></span>}
            <img
              src={style?.photos[0]?.thumbnail_url || brokenImage}
              alt={style?.name}
            />
          </div>
        ))}
      </div>
    </div >
  );
};


export default StyleSelector;