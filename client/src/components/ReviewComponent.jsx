import React from 'react';
import { StyledReviewComponent, UserInfo, UserAvatar, UserName, Rating, StarRating } from './StyledReviewComponent';
import StarRatingComponent from 'react-star-rating-component';
import avatar from '../images/default_profile.jpg';    // dummy avatar, will change later

function ReviewComponent(props) {
    const { user, rating, text } = props;
    return (
        <StyledReviewComponent>
            <UserInfo>
                <UserAvatar src={avatar}/>
                <UserName>{user}</UserName>
            </UserInfo>
            <Rating>
                <StarRating>
                    <StarRatingComponent
                        name="rating"
                        editing={false}
                        starCount={5}
                        value={rating}
                    />
                </StarRating>
                {text}
            </Rating>
        </StyledReviewComponent>
    )
}

export default ReviewComponent;
