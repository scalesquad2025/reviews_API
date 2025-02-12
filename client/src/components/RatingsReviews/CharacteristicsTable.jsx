import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CharacteristicsTable = ({setSize, setWidth, setComfort, setQuality, setProdLength, setFit}) => {

  // Radio button handlers
  const handleSize = (input) => {
    setSize(input);
  }

  const handleWidth = (input) => {
    setWidth(input);
  }
  const handleComfort = (input) => {
    setComfort(input);
  }
  const handleQuality = (input) => {
    setQuality(input);
  }
  const handleProdLength = (input) => {
    setProdLength(input);
  }
  const handleFit = (input) => {
    setFit(input);
  }


  const chars = useSelector((state) => {
    return state.productBreakdown.characteristics;
  })

  // All possible characteristic rows for table
  const sizeRow =
    <tr className="charTable">
      <th scope="row" className="charTable">Size</th>
      <td className="charTable">A size too small<input className="charRadio" name="sizeRad" type="radio" onClick={() => handleSize(1)}/></td>
      <td className="charTable">Half a size too small<input className="charRadio" name="sizeRad" type="radio" onClick={() => handleSize(2)}/></td>
      <td className="charTable">Perfect<input className="charRadio" name="sizeRad" type="radio" onClick={() => handleSize(3)}/></td>
      <td className="charTable">Half a size too big<input className="charRadio" name="sizeRad" type="radio" onClick={() => handleSize(4)}/></td>
      <td className="charTable">A size too big<input className="charRadio" name="sizeRad" type="radio" onClick={() => handleSize(5)}/></td>
    </tr>;

    const widthRow =
      <tr className="charTable">
        <th scope="row" className="charTable">Width</th>
        <td className="charTable">Too narrow<input className="charRadio" name="widthRad" type="radio" onClick={() => handleWidth(1)}/></td>
        <td className="charTable">Slightly narrow<input className="charRadio" name="widthRad" type="radio" onClick={() => handleWidth(2)}/></td>
        <td className="charTable">Perfect<input className="charRadio" name="widthRad" type="radio" onClick={() => handleWidth(3)}/></td>
        <td className="charTable">Slightly wide<input className="charRadio" name="widthRad" type="radio" onClick={() => handleWidth(4)}/></td>
        <td className="charTable">Too Wide<input className="charRadio" name="widthRad" type="radio" onClick={() => handleWidth(5)}/></td>
      </tr>;

      const comfortRow =
        <tr className="charTable">
          <th scope="row" className="charTable">Comfort</th>
          <td className="charTable">Uncomfortable<input className="charRadio" name="comfortRad" type="radio" onClick={() => handleComfort(1)}/></td>
          <td className="charTable">Slightly uncomfortable<input className="charRadio" name="comfortRad" type="radio" onClick={() => handleComfort(2)}/></td>
          <td className="charTable">Ok<input className="charRadio" name="comfortRad" type="radio" onClick={() => handleComfort(3)}/></td>
          <td className="charTable">Comfortable<input className="charRadio" name="comfortRad" type="radio" onClick={() => handleComfort(4)}/></td>
          <td className="charTable">Perfect<input className="charRadio" name="comfortRad" type="radio" onClick={() => handleComfort(5)}/></td>
        </tr>;

      const qualityRow =
        <tr className="charTable">
          <th scope="row" className="charTable">Quality</th>
          <td className="charTable">Poor<input className="charRadio" name="qualityRad" type="radio" onClick={() => handleQuality(1)}/></td>
          <td className="charTable">Below average<input className="charRadio" name="qualityRad" type="radio" onClick={() => handleQuality(2)}/></td>
          <td className="charTable">What I expected<input className="charRadio" name="qualityRad" type="radio" onClick={() => handleQuality(3)}/></td>
          <td className="charTable">Pretty great<input className="charRadio" name="qualityRad" type="radio" onClick={() => handleQuality(4)}/></td>
          <td className="charTable">Perfect<input className="charRadio" name="qualityRad" type="radio" onClick={() => handleQuality(5)}/></td>
        </tr>;

      const lengthRow =
        <tr className="charTable">
          <th scope="row" className="charTable">Length</th>
          <td className="charTable">Runs short<input className="charRadio" name="lengthRad" type="radio" onClick={() => handleProdLength(1)}/></td>
          <td className="charTable">Runs slightly short<input className="charRadio" name="lengthRad" type="radio" onClick={() => handleProdLength(2)}/></td>
          <td className="charTable">Perfect<input className="charRadio" name="lengthRad" type="radio" onClick={() => handleProdLength(3)}/></td>
          <td className="charTable">Runs slightly long<input className="charRadio" name="lengthRad" type="radio" onClick={() => handleProdLength(4)}/></td>
          <td className="charTable">Runs long<input className="charRadio" name="lengthRad" type="radio" onClick={() => handleProdLength(5)}/></td>
        </tr>;

      const fitRow =
        <tr className="charTable">
          <th scope="row" className="charTable">Fit</th>
          <td className="charTable">Runs tight<input className="charRadio" name="fitRad" type="radio" onClick={() => handleFit(1)}/></td>
          <td className="charTable">Runs slightly tight<input className="charRadio" name="fitRad" type="radio" onClick={() => handleFit(2)}/></td>
          <td className="charTable">Perfect<input className="charRadio" name="fitRad" type="radio" onClick={() => handleFit(3)}/></td>
          <td className="charTable">Runs slightly loose<input className="charRadio" name="fitRad" type="radio" onClick={() => handleFit(4)}/></td>
          <td className="charTable">Runs loose<input className="charRadio" name="fitRad" type="radio" onClick={() => handleFit(5)}/></td>
        </tr>;


  if (chars === undefined) {
    return null;
  }

  return (
    <div>
      <table className="charTable">
            <caption>
              Product Characteristics
            </caption>
            <tbody>
              <tr className="charTable">
                <th scope="col" className="charTable, colHead"></th>
                <th scope="col" className="charTable, colHead">1</th>
                <th scope="col" className="charTable, colHead">2</th>
                <th scope="col" className="charTable, colHead">3</th>
                <th scope="col" className="charTable, colHead">4</th>
                <th scope="col" className="charTable, colHead">5</th>
              </tr>
              {chars.Size ? sizeRow : null}
              {chars.Width ? widthRow : null}
              {chars.Comfort ? comfortRow : null}
              {chars.Quality ? qualityRow : null}
              {chars.Length ? lengthRow : null}
              {chars.Fit ? fitRow : null}
            </tbody>
          </table>
    </div>
  );
}

export default CharacteristicsTable;