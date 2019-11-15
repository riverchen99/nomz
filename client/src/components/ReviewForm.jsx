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
    return (
      <StyledReviewForm onSubmit={this.handleSubmit}>
        <TextInput 
          type="text" 
          value={this.props.review_text} 
          onChange={this.handleChange} 
          rows={8} 
          required
          placeholder={"Write your review here!"}/>
        <SubmitComponent>
          Your name and profile picture will be shown on the review.
          <Button type="submit" text="Post Review" color="rgb(239, 57, 255)" />
        </SubmitComponent>
      </StyledReviewForm>
    );
  }
}

export default ReviewForm;
