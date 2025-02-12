import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCart, postCart, putCart } from '../../store/cartSlice.js';


const AddToCart = ({ selectedStyle, setSelectedStyle, selectedSize, setSelectedSize, quantity, setQuantity }) => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const id = useSelector(state => state.products.currentProduct) || 40347;
  const details = useSelector(state => state.products.productDetails?.[id]);
  const styles = useSelector(state => state.products.productStyles?.[id]?.results) || [];


  if (!details || !styles.length) {
    return <div className="loading-message">Loading product details...</div>;
  }


  const skus = selectedStyle?.skus ?
    Object.entries(selectedStyle.skus).map(([skuId, data]) => ({
      id: skuId,
      size: data.size,
      quantity: data.quantity
    })).filter(item => item.quantity > 0) : [];

  const selectedSku = skus.find(sku => sku.size === selectedSize);
  const maxQuantity = selectedSku ? Math.min(selectedSku.quantity, 15) : 0;

  const quantityOptions = [];
  for (let i = 1; i <= maxQuantity; i++) {
    quantityOptions.push(i);
  };

  const handleClick = () => {
    if (selectedSku?.id) dispatch(postCart({ sku_id: selectedSku?.id, count: quantity }));
    setSelectedSize('');
    setQuantity(1);
    if (!selectedSku) window.alert('Pick a size and quantity to continue')
    else window.alert(`Item: ${selectedSku?.id}, Size: ${selectedSku?.size}, Quantity: ${quantity} added to cart`)
  };

  return (
    <div className="cart-container">
      <div className="selectors">
        <select
          value={selectedSize}
          className="size-selector"
          data-testid="size-selector"
          name='size'
          disabled={!skus.length}
          onChange={(e) => {
            setSelectedSize(e.target.value);
            setQuantity(1);
          }}
        >
          <option value="">{!skus.length ? "OUT OF STOCK" : 'Select Size'}</option>
          {skus.map(data => (
            <option key={data.id} value={data.size}>
              {data.size}
            </option>
          ))}
        </select>
        <select
          className="quantity-selector"
          data-testid="quantity-selector"
          value={quantity}
          name='quantity'
          onChange={(e) => setQuantity(e.target.value)}
          disabled={!selectedSize || !skus.length}
        >
          {selectedSize ? (
            quantityOptions.map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))
          ) : (
            <option value="1">-</option>
          )}
        </select>
      </div>
      <div className="add-to-bag">
        <button
          className="add-to-bag-button"
          data-testid="add-to-bag-button"
          disabled={!skus.length}
          onClick={handleClick}
        >
          ADD TO BAG
          <span className='plus-icon'>+</span>
        </button>
        <button className="favorite-button">★</button>
      </div>
      {details?.features && (
        <div className="features-list">
          {details.features.map((element, index) => (
            <div key={index} className="feature-item">
              <i className="checkmark-features fa-solid fa-check"></i>
              <span className="feature-name">{element.feature}</span>:
              <span className="feature-value"> {element.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToCart;