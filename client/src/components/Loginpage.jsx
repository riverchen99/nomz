import React from 'react';
import { Link } from 'react-router-dom';
import { StyledLoginpage, Title, Text } from './StyledLoginpage';

class Loginpage extends React.Component {
  render () {
    return (
      <StyledLoginpage>
        <Title>nomz</Title>
        <Text>Personalized recommendations based on your ratings</Text>
        <a href="/auth/facebook"><div class="fb-login-button" data-width="" data-size="large" data-button-type="continue_with" data-auto-logout-link="false" data-use-continue-as="false"></div></a>
        <p>Or <Link to="/recommend" style={{ fontWeight: 'bold', color: 'white' }}>continue as guest</Link></p>
      </StyledLoginpage>
    )
  }
}

export default Loginpage;
