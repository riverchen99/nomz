import React from 'react';
import { Link } from 'react-router-dom';
import { StyledLoginpage, Title, Text } from './StyledLoginpage';
import fb_button from "../images/fb_login.png"

class Loginpage extends React.Component {
  render () {
    return (
      <StyledLoginpage>
        <Title>nomz</Title>
        <Text>Personalized recommendations based on your ratings</Text>
        <a href="/auth/facebook"><img src={fb_button} width="300" alt="Facebook login button" /></a>
        <p>Or <Link to="/recommend" style={{ fontWeight: 'bold', color: 'white' }}>continue as guest</Link></p>
      </StyledLoginpage>
    )
  }
}

export default Loginpage;
