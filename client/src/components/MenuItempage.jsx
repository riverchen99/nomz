import React from 'react';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';
import { StyledMenuItempage, MenuItemBox, MenuItemHeader, MenuItemInfoHeader, MenuItemInfoName, MenuItemInfoRating, MenuItemInfoRestaurant, Heading } from './StyledMenuItempage';
import ReviewComponent from './ReviewComponent';
import ReviewForm from './ReviewForm';
import EditableStarRating from './EditableStarRating';

class MenuItempage extends React.Component {
  constructor(props) {
    super(props);

    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleReviewChange = this.handleReviewChange.bind(this);
    this.handleReviewSubmit = this.handleReviewSubmit.bind(this);
    this.getMenuItem = this.getMenuItem.bind(this);
    this.getReviews = this.getReviews.bind(this);
    this.state = {
      reviewText: '',
      starRating: 0,
      itemName: '',
      restaurantName: '',
      aggregateRating: 0,
      reviews: null,
    };
  }

  componentDidMount() { 
    this.getMenuItem();
    this.getReviews();
  }

  handleRatingChange(rating) {
    this.setState({starRating: rating });
  }

  handleReviewChange(review) {
    this.setState({reviewText: review });
  }

  handleReviewSubmit() {
    alert('Rating: ' + this.state.starRating + ', Review: ' + this.state.reviewText);
  }

  getMenuItem() {
    const { name, id } = this.props.location.state;
    this.setState( { itemName: name });
    axios.get(`/api/menuitems/${id}`)
      .then((resp) => {
        const item = resp.data[0];
        const rating = item.rating;
        this.setState({ aggregateRating: rating });
        const restaurantID = item.restaurant;
        axios.get(`/api/restaurants/${restaurantID}`)
          .then((resp) => {
            const item = resp.data[0];
            this.setState({ restaurantName: item.name });
          })
      });
  }

  getReviews() {
    const { id } = this.props.location.state;
    axios.get(`/api/reviews`)
      .then((resp) => {
        const reviews = resp.data.filter(review => 
          review.menuItem === id);
        const itemReviews = reviews.map(review =>  
          <ReviewComponent key={this.state.itemName + resp.data.indexOf(review)} review={review} />
        )
        this.setState({ reviews: itemReviews });
    });
  }

  render() {
    return (
      <StyledMenuItempage>
        <MenuItemBox>
          <MenuItemHeader>
            <MenuItemInfoHeader>
              <MenuItemInfoName>{this.state.itemName}</MenuItemInfoName>
              <MenuItemInfoRestaurant>{this.state.restaurantName}</MenuItemInfoRestaurant>
            </MenuItemInfoHeader>
            <MenuItemInfoRating>
              <StarRatingComponent name="rating" editing={false} starCount={5} value={this.state.aggregateRating} />
            </MenuItemInfoRating>
          </MenuItemHeader>
          <Heading>Write a review!</Heading>
          <EditableStarRating onRatingChange={this.handleRatingChange} />
          <ReviewForm onReviewChange={this.handleReviewChange} onReviewSubmit={this.handleReviewSubmit} />
          <Heading>Reviews</Heading>
          {this.state.reviews}
        </MenuItemBox>
      </StyledMenuItempage>
    )
  }
}

export default MenuItempage;
