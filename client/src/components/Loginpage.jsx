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
<<<<<<< HEAD
        {/* <a href="/auth/facebook">Login with Facebook</a> */}
        <a href="http://localhost:8080/auth/facebook">Login with Facebook</a>
        <p>Or <Link to="/recommend">continue as guest</Link></p>
=======
        <a href="/auth/facebook"><img src={fb_button} width="300" alt="Facebook login button" /></a>
        <p>Or <Link to="/recommend" style={{ fontWeight: 'bold', color: 'white' }}>continue as guest</Link></p>
>>>>>>> 4bbe1401ffa90772f694e00c68092f0059364bfa
      </StyledLoginpage>
    )
  }
}

export default Loginpage;
