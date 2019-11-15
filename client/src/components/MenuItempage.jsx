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

  /**
   * Function that handles changing the state of the starRating,
   * passed as a prop to the EditableStarRating component.
   * @param {Number} rating - Holds newly updated rating value
   */
  handleRatingChange(rating) {
    this.setState({starRating: rating });
  }
  
  /**
   * Function that handles changing the state of the review 
   * as you type
   * @param {String} review - Holds updated value for review text
   */
  handleReviewChange(review) {
    this.setState({reviewText: review });
  }

  /**
   * Function that handles checking to make sure a rating is 
   * eligible to be submitted, and submits it to the data via
   * an API POST request if eligible.
   * Once submitted, the reviews on the page are re-rendered
   */
  handleReviewSubmit() {
    // this code assumes we will be passed in a location.state via the router
    const { id } = this.props.location.state;
    // only allow review to be submitted if a rating is given (0 by default)
    if (this.state.starRating < 1) {
      alert('Please give a rating.'); 
    }
    else {
      axios.post('/api/reviews', {
        menuItem: id,
        author: "5dcd2aa442e56ac143e24b6d", // currently hard coded since no user login yet
        rating: this.state.starRating,
        comments: this.state.reviewText
      })
      .then((resp) => console.log(resp));
      this.getReviews();
    }
  }

  /**
   * Function that calls the API to get information about the 
   * current menu item and sets the states to hold the info.
   */
  getMenuItem() {
    // this code assumes we will be passed in a location.state via the router
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

  /**
   * Function to grab all of the reviews for the current menu 
   * item from the api via axios get call and generate
   * the list of ReviewComponents that will be displayed
   * on the page.
   */
  getReviews() {
    const { id } = this.props.location.state;
    axios.get(`/api/reviews`)
      .then((resp) => {
        // filter for reviews of the current menu item only
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
