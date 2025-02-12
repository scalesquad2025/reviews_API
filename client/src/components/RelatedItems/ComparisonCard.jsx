import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const ComparisonCard = ({ item }) => {

  var currentItemFeatures;
  var comparisonItemFeatures;

  const [featureData, setFeatureData]  = useState([]);

  const currentItem = useSelector((state) => {
    return state.relatedItems.currentProductDetails
  })

  const comparisonFeatures = useSelector((state) => {
    return state.relatedItems.comparisonFeatures
  })

  const TableRow = ({value1, feature, value2}) => {

    return (
      <tr>
        <td>{value1 === undefined ? null : value1}</td>
        <td>{feature}</td>
        <td>{value2 === undefined ? null : value2}</td>
      </tr>
    )
  }

  useEffect(() => {
    var comparisonItem = item;
    var relevantItems = [];
    comparisonItemFeatures = (comparisonFeatures.find((item) => item.currentObjectId === comparisonItem.id)).currentObject
    currentItemFeatures = (comparisonFeatures.find((item) => item.currentObjectId === currentItem.id)).currentObject
    relevantItems.push(comparisonItemFeatures, currentItemFeatures)
    var features = new Set();
    relevantItems.forEach((item) => {
      for(var i = 0; i < item.length; i++) {
        features.add(item[i].feature)
      }
    })
    var featuresArray = [];
    var featuresObject = {};
    for (var value of features) {
      for(var j = 0; j < currentItemFeatures.length; j++) {
        if (currentItemFeatures[j].feature === value) {
          featuresObject[value] = {feature: value, value1: currentItemFeatures[j].value}
        }
      }
      for(var k = 0; k < comparisonItemFeatures.length; k++) {
        if (comparisonItemFeatures[k].feature === value) {
          var value2 = {value2: comparisonItemFeatures[k].value}
          var feature = {feature: value}
          featuresObject[value] = {...feature, ...featuresObject[value], ...value2}
        }
      }
    }
    for (var key in featuresObject) {
      featuresArray.push(featuresObject[key])
    }
    setFeatureData(featuresArray);

  }, [])

  return (
    <div className = "comparisonCard">
      <small>Comparing</small>
      <table className = "comparisonTable">
        <tbody>
        <tr>
          <th>{currentItem.name}</th>
          <th>&nbsp;</th>
          <th>{item.name}</th>
        </tr>
        {featureData.map((feature, index) => <TableRow value1 = {feature.value1} feature = {feature.feature} value2 = {feature.value2} key = {index}/>) }
        </tbody>
      </table>
    </div>
  )
}


export default ComparisonCard;