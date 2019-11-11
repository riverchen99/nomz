import React from 'react';
import MenuItem from './MenuItem';
import Button from './Button';
import { MenuItemWrapper } from './StyledRecommendpage';
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
        <div>
          <h3>Top picks for:</h3>
          <Dropdown options={userOptions} onChange={(value) => this.updateUser(value.label)} value={userDefaultOption} />
          <Dropdown options={userOptions} />
          <Button text={"Go"} color={"#EF39FF"} handleClick={() => this.generateRecs()}/>
        </div>
        {this.state.menuItems}
      </div>
    )
  }
}

export default Recommendpage;