import styled from 'styled-components';

export const StyledReviewComponent = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 20%;
    background-color: white;
    border: 2px solid rgb(196, 196, 196);
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2%;
    align-items: center;
`;

export const UserAvatar = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 35px;
    -webkit-border-radius: 35px;
    -moz-border-radius: 35px;
`;

export const UserName = styled.div`
    font-size: 18px;
    font-weight: bold;
`;

export const Rating = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 2%;
`;

export const StarRating = styled.div`
    font-size: 30px;
`;
