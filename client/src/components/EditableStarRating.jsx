import React from 'react';
import StarRatingComponent from 'react-star-rating-component';

class EditableStarRating extends React.Component {
  constructor(props) {
    super(props);

    this.onStarClick = this.onStarClick.bind(this);
  }

  onStarClick(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.props.onRatingChange(nextValue);
  }

  render() {
    return (
      <div style={{fontSize: 50 }}>
        <StarRatingComponent 
          name="starRating"
          starColor="#FFC32B"
          emptyStarColor="#C4C4C4"
          value={this.props.star_rating}
          onStarClick={this.onStarClick} />
      </div>
    );
  }
}

export default EditableStarRating;
