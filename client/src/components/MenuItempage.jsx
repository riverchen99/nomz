import React from 'react';
import axios from 'axios';
import { StyledMenuItempage, MenuItemBox } from './StyledMenuItempage';
import ReviewComponent from './ReviewComponent';

class MenuItempage extends React.Component {
    render() {
        return (
            <StyledMenuItempage>
                <MenuItemBox>
                    <h1>Reviews</h1>
                    <ReviewComponent user="User 1" rating={5} text="The shrimp scampi pizza is amazing! This is honestly the best pizza I’ve ever had!"/>
                    <ReviewComponent user="User 2" rating={4} text="It can be a little salty sometimes depending on the day, but usually it is perfect. 10/10 would recommend."/>
                    <ReviewComponent user="User 3" rating={3} text="Could have been better. Not bad but not great. You can get better pizza at Dominos."/>
                </MenuItemBox>
            </StyledMenuItempage>
        )
    }
}

export default MenuItempage;