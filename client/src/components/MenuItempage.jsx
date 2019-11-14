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
      review_text: '',
      star_rating: 0,
      item_name: '',
      restaurant: '',
      aggregate_rating: '',
    };
  }

  componentDidMount() { 
    this.getMenuItem();
  }

  handleRatingChange(rating) {
    this.setState({star_rating: rating });
  }

  handleReviewChange(review) {
    this.setState({review_text: review });
  }

  handleReviewSubmit() {
    alert('Rating: ' + this.state.star_rating + ', Review: ' + this.state.review_text);
  }

  getMenuItem() {
    const { name, id } = this.props.location.state;
    this.setState( { item_name: name });
    axios.get(`/api/menuitems/${id}`)
    .then((resp) => {
      const item = resp.data[0];
      const rating = item.rating;
      this.setState({ aggregate_rating: rating });
      const restaurantID = item.restaurant;
      // axios.get(`/api/restaurants/${restaurantID}`)
      // .then((resp) => {
      //   const item = resp.data[0];
      //   console.log(item);
      // })
    });
  }

  render() {
    const { name, id } = this.props.location.state;
    return (
      <StyledMenuItempage>
        <MenuItemBox>
          <MenuItemHeader>
            <MenuItemInfoHeader>
              <MenuItemInfoName>{name}</MenuItemInfoName>
              <MenuItemInfoRestaurant>Cafe 1919</MenuItemInfoRestaurant>
            </MenuItemInfoHeader>
            <MenuItemInfoRating>
              <StarRatingComponent name="rating" editing={false} starCount={5} value={this.state.aggregate_rating} />
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
