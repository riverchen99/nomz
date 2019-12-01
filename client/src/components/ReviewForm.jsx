import React from 'react';
import { StyledReviewForm, TextInput, SubmitComponent } from './StyledReviewForm';
import Button from './Button';

class ReviewForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.props.onReviewChange(event.target.value);
  }

  handleSubmit(event) {
    this.props.onReviewSubmit();
    event.preventDefault();
  }

  render() {
    var buttonText = "Post Review";
    if (this.props.reviewText === '' && this.props.starRating === 0) {
      buttonText = "Post Review";
    } else {
      buttonText = "Update Review";
    }
    return (
      <StyledReviewForm onSubmit={this.handleSubmit}>
        <TextInput 
          type="text" 
          value={this.props.reviewText} 
          onChange={this.handleChange} 
          rows={8} 
          required
          placeholder={"Write your review here!"}/>
        <SubmitComponent>
          Your name and profile picture will be shown on the review.
          <Button type="submit" text={buttonText} color="rgb(239, 57, 255)" width="200px"/>
        </SubmitComponent>
      </StyledReviewForm>
    );
  }
}

export default ReviewForm;
