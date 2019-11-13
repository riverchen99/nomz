import React from 'react';
import { Link } from 'react-router-dom';
import { StyledLoginpage, Title, Text } from './StyledLoginpage';

class Loginpage extends React.Component {
  render () {
    return (
      <StyledLoginpage>
        <Title>nomz</Title>
        <Text>Personalized recommendations based on your ratings</Text>
        <p>facebook login button goes here</p>
        <p>Or <Link to="/recommend">continue as guest</Link></p>
      </StyledLoginpage>
    )
  }
}

export default Loginpage;
