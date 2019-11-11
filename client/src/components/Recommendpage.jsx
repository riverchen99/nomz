import React from 'react';
import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import Button from './Button';
import { MenuItemWrapper, DropdownContainer, TextWrapper } from './StyledRecommendpage';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import axios from 'axios';

class Recommendpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      user: "",
      menuItems: null 
    };
    this.updateUser = this.updateUser.bind(this);
    this.generateRecs = this.generateRecs.bind(this);

  }

  componentDidMount() {
    this.generateRecs();
  }

  updateUser(option) {
    this.setState({
      user: option.label,
    });
    console.log(this.state.user);
  }

  generateRecs() {
    console.log("hi");
    axios.get('/api/menuitems')
    .then((resp) => { 
      console.log(resp.data);
      const items = resp.data.map(item => 
        <MenuItemWrapper>
          <MenuItem key={item.name} itemName={item.name} restaurant={item.restaurant} rating={item.rating} />
        </MenuItemWrapper>
      )
      this.setState({ menuItems: items });
    });
  }

  render () {
    const userOptions = [
      {value: 'everyone', label: 'Everyone'},
      {value: 'me', label: 'Me'}
    ];
    const userDefaultOption = userOptions[0];
    return (
      <div>
        <h1>What are you craving?</h1>
<<<<<<< HEAD
        <p><Link to="/menuitem">Click here to view menu item</Link></p>
=======
        <div>
          <span>
            {/* <TextWrapper> */}
              <TextWrapper>Top picks for:</TextWrapper>
            {/* </TextWrapper> */}
            <DropdownContainer>
            <Dropdown options={userOptions} onChange={(val) => this.updateUser(val)} value={userDefaultOption} />
            </DropdownContainer>
          </span>

          <Dropdown options={userOptions} />
          <Button text={"Go"} color={"#EF39FF"} handleClick={() => this.generateRecs()}/>
        </div>
        {this.state.menuItems}
>>>>>>> effcb1edf12d2ad2034d139617b0898ea0c3cf35
      </div>
    )
  }
}

export default Recommendpage;
