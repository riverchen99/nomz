import React from 'react';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';
import { StyledMenuItempage, MenuItemBox, MenuItemHeader, MenuItemInfoHeader, MenuItemInfoName, MenuItemInfoRating, MenuItemInfoRestaurant, Heading, NoReviewsDisplay } from './StyledMenuItempage';
import ReviewComponent from './ReviewComponent';
import ReviewForm from './ReviewForm';
import EditableStarRating from './EditableStarRating';
import NavBar from './NavBar';
import { thisExpression } from '@babel/types';

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
      loggedIn: false,
      user: null,
      alreadyRated: false,
    };
  }

  componentDidMount() { 
    axios.get('/auth/user').then(response => {
      console.log(response.data)
      if (!!response.data.user) {
        this.setState({
          loggedIn: true,
          user: response.data.user
        })
      } else {
        this.setState({
          loggedIn: false,
          user: null
        })
      }
    })

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
    if (this.state.loggedIn === false) {
      alert('You must be logged in order to submit a review.');
    } else if (this.state.starRating < 1) {
      alert('Please give a rating.'); 
    } else {
      if (this.state.alreadyRated) {
        console.log(this.state.reviewText);
        console.log(this.state.starRating);
        axios.put('/api/reviews',
          {filter: {menuItem: id, author: this.state.user }, update: { rating: this.state.starRating, comments: this.state.reviewText.toString() }})
          .then((resp) => console.log(resp));
      } else {
        axios.post('/api/reviews', {
          menuItem: id,
          author: this.state.user, 
          rating: this.state.starRating,
          comments: this.state.reviewText
        })
        .then((resp) => console.log(resp));
      }
      this.getMenuItem();
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
        console.log(rating);
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
        /**
         * Filter for reviews of the current menu item only.
         * Only reviews with texts are displayed, however
         * rating only reviews (from extension) from the extension are
         * factored in for the calculation of the rating
         */
        var reviews = resp.data.filter(review => 
          review.menuItem === id && review.comments != null);
        if (this.state.loggedIn) {
          const userReview = resp.data.filter(review => review.author === this.state.user._id && review.menuItem === id);
          if (userReview.length !== 0) {
            this.setState({alreadyRated: true});
            const currentReview = userReview[0];
            this.setState({reviewText: currentReview.comments, starRating: currentReview.rating } );
          }
        }
        var itemReviews = reviews.map(review =>  
          <ReviewComponent key={this.state.itemName + resp.data.indexOf(review)} review={review} />
        )
        if (itemReviews.length === 0) {
          itemReviews = <NoReviewsDisplay>No reviews to display. Be the first to write a review!</NoReviewsDisplay>
        } 
        this.setState({ reviews: itemReviews });
    });
  }

  render() {
    return (
      <StyledMenuItempage>
        <MenuItemBox>
          <NavBar userName={this.state.loggedIn ? this.state.user.name : "Guest"} />
          <MenuItemHeader>
            <MenuItemInfoHeader>
              <MenuItemInfoName>{this.state.itemName}</MenuItemInfoName>
              <MenuItemInfoRestaurant>{this.state.restaurantName}</MenuItemInfoRestaurant>
            </MenuItemInfoHeader>
            <MenuItemInfoRating>
              <StarRatingComponent name="rating" editing={false} starCount={5} value={this.state.aggregateRating} emptyStarColor="#C4C4C4"/>
            </MenuItemInfoRating>
          </MenuItemHeader>
          <Heading>Write a review!</Heading>
          <EditableStarRating onRatingChange={this.handleRatingChange} starRating={this.state.starRating}/>
          <ReviewForm onReviewChange={this.handleReviewChange} onReviewSubmit={this.handleReviewSubmit} reviewText={this.state.reviewText} starRating={this.state.starRating}/>
          <Heading>Reviews</Heading>
          {this.state.reviews}
        </MenuItemBox>
      </StyledMenuItempage>
    )
  }
}

export default MenuItempage;
