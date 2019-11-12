import React from 'react';
import MenuItem from './MenuItem';
import Button from './Button';
import { 
  MenuItemWrapper,
  DropdownContainer,
  TextWrapper,
  FilterContainer,
  Header 
} from './StyledRecommendpage';
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

    const dayOptions = [
      {value: 'today', label: 'Today'},
      {value: 'tomorrow', label: 'Tomorrow'}
    ]
    const dayDefaultOption = dayOptions[0];

    return (
      <div>
        <Header>What are you craving?</Header>
        <FilterContainer>
          <span>
            <h3>Top picks for:</h3>
            <DropdownContainer>
            <Dropdown options={userOptions} onChange={(val) => this.updateUser(val)} value={userDefaultOption} />
            </DropdownContainer>
          </span>
          <DropdownContainer>
            <Dropdown options={dayOptions} value={dayDefaultOption} />
          </DropdownContainer>
          <Button text={"Go"} color={"#EF39FF"} handleClick={() => this.generateRecs()}/>
        </FilterContainer>
        {this.state.menuItems}
      </div>
    )
  }
}

export default Recommendpage;
