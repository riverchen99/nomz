import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import { ItemTitle, StarWrapper } from './StyledMenuItem';

function MenuItem (props) {
    const { itemName, restaurant, rating } = props;
    return (
      <div>
        <StarWrapper><StarRatingComponent name={itemName} value={rating} emptyStarColor={"#cccccc"} editing={false} /></StarWrapper>
        <div>
          <ItemTitle>{itemName}</ItemTitle>
          <p>{restaurant}</p>
          <p>Click for details</p>
        </div>
      </div>
    )
}

export default MenuItem;
