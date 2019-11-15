import React from 'react';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';
import { StyledReviewComponent, UserInfo, UserAvatar, UserName, Rating, StarRating } from './StyledReviewComponent';
import avatar from '../images/default_profile.jpg'; // dummy avatar, will change later

class ReviewComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      userName: '',
      starRating: 0,
      textReview: '',
    }
  }

  componentDidMount() {
    if (this.props.review != null) {
      axios.get(`/api/users/${this.props.review.author}`)
      .then((resp) => {
        this.setState({ userName: resp.data[0].name, starRating: this.props.review.rating, textReview: this.props.review.comments });
      })
      return 0;
    }
    else
      return 1;
  }

  render() {
    return (
      <StyledReviewComponent>
        <UserInfo>
          <UserAvatar src={avatar}/>
          <UserName>{this.state.userName}</UserName>
        </UserInfo>
        <Rating>
          <StarRating>
            <StarRatingComponent name="rating" editing={false} starCount={5} value={this.state.starRating} />
          </StarRating>
          {this.state.textReview}
        </Rating>
      </StyledReviewComponent>
    )
  }
}

export default ReviewComponent;
