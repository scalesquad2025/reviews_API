import React, { useState, useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ImageGallery from './ImageGallery.jsx';
import ProductDetails from './ProductDetails.jsx';
import AddToCart from './AddToCart.jsx';
import StyleSelector from './StyleSelector.jsx';
import { getProducts, getProductDetails, getProductStyles } from '../../store/productsSlice.js';

import './ProductOverview.css';


const ProductOverview = () => {
  const dispatch = useDispatch();

  const id = useSelector(state => state.products?.currentProduct) || 40347;
  const styles = useSelector(state => state?.products?.productStyles?.[id]?.results) || [];
  const error = useSelector(state => state?.products?.error);
  const details = useSelector(state => state?.products?.productDetails?.[id]);
  const status = useSelector(state => state?.products?.status);

  const [selectedStyle, setSelectedStyle] = useState(styles?.[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);


  useEffect(() => {
    if (styles?.length) setSelectedStyle(styles?.[0]);
  }, [styles]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getProducts());
        await dispatch(getProductDetails());
        await dispatch(getProductStyles());
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (status === 'idle' && (!details || !styles)) fetchData();

  }, [dispatch, status, details, styles]);


  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!details || !styles) return <div>Loading product details...</div>;

  return (
    <div className='product-container'>
      <div className='left-column'>
        <ImageGallery
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        />
      </div>
      <div className='right-column'>
        <ProductDetails />
        <StyleSelector
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        />
        <AddToCart
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
    </div>
  )
}

export default ProductOverview;