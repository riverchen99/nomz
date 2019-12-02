import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/nomz_logo.png';
import HamburgerMenu from '../images/hamburger_menu.png';
import { StyledNavBar, LogoImage, User, HamburgerImage, Menu, Wrapper, Item } from './StyledNavBar';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: (this.props.userName === "Guest") ? false : true,
      expanded: false,
    }
  }
  render() {
    let lastLinks;
    if (this.state.loggedIn) {
      lastLinks = (
        <React.Fragment>
          <Item><Link to={{ pathname: '/profile'}} style={{ textDecoration: 'none', color: '#888888' }}>Profile</Link></Item>
          <Item><a href="/auth/logout">Logout</a></Item>
        </React.Fragment>);
    }
    else {
      lastLinks = <div></div>;
    }
    return (
      <Wrapper>
        <StyledNavBar>
          <a href='/'><LogoImage src={Logo} /></a>
          <User>{this.props.userName}</User>
          <HamburgerImage src={HamburgerMenu} onClick={() => this.setState(prevState => ({ expanded: !prevState.expanded })) }></HamburgerImage>
        </StyledNavBar>
        <Menu expanded={this.state.expanded} >
          <Item><Link to={{ pathname: '/recommend'}} style={{ textDecoration: 'none', color: '#888888' }}>Top Rated</Link></Item>
          <Item><Link to={{ pathname: '/allmenus' }} style={{ textDecoration: 'none',  color: '#888888' }}>Menus</Link></Item>
          {lastLinks}
        </Menu>
      </Wrapper>
    )
  }
}

export default NavBar;
