import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { StyledLoginpage, Title } from './StyledLoginpage';

class Loginpage extends React.Component {
  render () {
    return (
      <StyledLoginpage>
        <Title>nomz</Title>
        <p>Personalized recommendations based on your ratings</p>
        <Button text="Login" color="white"/>
        <p>Or <Link to="/recommend">continue as guest</Link></p>
      </StyledLoginpage>
    )
  }
}

export default Loginpage;