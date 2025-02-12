import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RelatedItemCard from './RelatedItemCard.jsx'
import { showPreviousCard, showNextCard, addToOutfit, getRelatedItems, getRelatedItemDetails, getRelatedItemURLs, clearRelatedItems, clearIndex, getCurrentProductDetails } from '../../store/relatedItemsSlice.js';
import Outfit from './Outfit.jsx'
import axios from 'axios';

const RelatedItems = () => {

  const dispatch = useDispatch();

  const [relatedItemIds, setRelatedItemIds] = useState([]);

  const currentProduct = useSelector((state) => {
    return state.products.currentProduct
  })

  const currentProductDetails =  useSelector((state) => {
    return state.relatedItems.currentProductDetails
  })

  const currentIndex = useSelector((state) => {
    return state.relatedItems.currentCardIndex
  })

  const status = useSelector((state) => {
    return state.relatedItems.status
  })


  const relatedItems = useSelector((state) => {
    return state.relatedItems.relatedItems
  })

  const url = useSelector((state) => {
    return state.relatedItems.relatedItemURLs
  })

  const carouselStyle = {
    transform: `translateX(-${currentIndex * 100}%)`
  }

    useEffect(() => {
      const fetchData = async () => {
        if (currentProduct) {
          const { payload: relatedItemIds } = await dispatch(getRelatedItems())
          await dispatch(getCurrentProductDetails(currentProduct))
          relatedItemIds.forEach((productId) => {
            dispatch(getRelatedItemDetails(productId))
            dispatch(getRelatedItemURLs(productId))
          })
      }
    }

    fetchData();

    }, [currentProduct]);

  return (
    relatedItems.length > 0 && Object.keys(currentProductDetails).length > 0 ? (
      <div className="relatedItems">
      <h2>Related Items</h2>
      <div className = "relatedItemsWrapper" >
        {relatedItems.map((item, index) => <RelatedItemCard item = {item} key = {index} style = {carouselStyle}/>)}
        {currentIndex === 0 ? null : <button className = "leftButton button" onClick = {() => dispatch(showPreviousCard())}>ᐸ</button>}
        {currentIndex === relatedItems.length - 3 ? null : <button className = "rightButton button" onClick = {() => dispatch(showNextCard())}>ᐳ</button>}
      </div>
      <h2>Your Outfit</h2>
      <Outfit currentProductDetails = {currentProductDetails}/>
    </div>
    ) : (
      <p>Loading...</p>
    )
  )
}

export default RelatedItems;


