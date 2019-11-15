import React from 'react';
import { Link } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import { ItemTitle, StarWrapper, StyledMenuItem } from './StyledMenuItem';

function MenuItem(props) {
  const {
    itemName,
    restaurant,
    rating,
    index,
    id
  } = props;
  return (
    <StyledMenuItem index={index}>
      <StarWrapper><StarRatingComponent name={itemName} value={rating} emptyStarColor={"#cccccc"} editing={false} /></StarWrapper>
      <React.Fragment>
        <ItemTitle index={index}>{itemName}</ItemTitle>
        <p>{restaurant}</p>
        <Link to={{ 
          pathname: `/menuitem/${itemName}`, 
          state: {name: itemName, id: id}}}
        >
          Click for details
        </Link>
      </React.Fragment>
    </StyledMenuItem>
  );
}

export default MenuItem;
