import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromOutfit } from '../../store/relatedItemsSlice.js';
import { showPreviousCard, showNextCard, addToOutfit, getRelatedItems, getRelatedItemDetails, getRelatedItemURLs } from '../../store/relatedItemsSlice.js';

const OutfitItemCard = ({item}) => {

  const dispatch = useDispatch();

  const outfit = useSelector((state) => state.relatedItems.outfit)

  const handleOutfitAction = () => {
    var comparisonItem = item;
    var index = outfit.indexOf(comparisonItem)
    dispatch(removeFromOutfit(index))
  }

  const urls = useSelector((state) => {
    return state.relatedItems.relatedItemURLs
  })

  const currentOutfitIndex = useSelector((state) => {
    return state.relatedItems.currentOutfitCardIndex;
  })

  const carouselStyle = {
    transform: `translateX(-${currentOutfitIndex * 100}%)`
  }

  return (
    <span className = "outfitItemCard" style = {carouselStyle}>
      <img className = "relatedItemImage" src = {urls[item.id]} alt = {item.name}></img>
      <span className = "actionButtonOutfit" onClick = {handleOutfitAction}><i class="fa-solid fa-x"></i></span>
      <div>{item.category}</div>
      <h3>{item.name}</h3>
      <div>&nbsp;</div>
      <div>{item.default_price}</div>
    </span>
  )
}

export default OutfitItemCard;