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
    <Link to={{ 
      pathname: `/menuitem/${itemName}`, 
      state: {name: itemName, id: id}}}
      style={{ textDecoration: 'none' }}
    >
      <StyledMenuItem index={index}>
        <StarWrapper><StarRatingComponent name={itemName} value={rating} emptyStarColor={"#cccccc"} editing={false} /></StarWrapper>
        <React.Fragment>
          <ItemTitle index={index}>{itemName}</ItemTitle>
          <p>{restaurant}</p>
        </React.Fragment>
      </StyledMenuItem>
    </Link>
  );
}

export default MenuItem;
