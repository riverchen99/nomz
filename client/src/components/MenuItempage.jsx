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
    this.state = {
      reviewText: '',
      starRating: 0,
      itemName: '',
      restaurantName: '',
      aggregateRating: 0,
    };
  }

  componentDidMount() { 
    this.getMenuItem();
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
          <ReviewComponent user="User 1" rating={5} text="The shrimp scampi pizza is amazing! This is honestly the best pizza I’ve ever had!"/>
          <ReviewComponent user="User 2" rating={4} text="It can be a little salty sometimes depending on the day, but usually it is perfect. 10/10 would recommend."/>
          <ReviewComponent user="User 3" rating={3} text="Could have been better. Not bad but not great. You can get better pizza at Dominos."/>
        </MenuItemBox>
      </StyledMenuItempage>
    )
  }
}

export default MenuItempage;
