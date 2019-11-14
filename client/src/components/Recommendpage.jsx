import React from 'react';
import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import Button from './Button';
import { 
  DropdownContainer,
  Text,
  FilterContainer,
  Header 
} from './StyledRecommendpage';
import {
  recommendeeOptions,
  dayOptions,
  recommendeeDefaultOption,
  dayDefaultOption
} from '../options.js';
import axios from 'axios';

// TESTING
import Select from 'react-select';

class Recommendpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      recommendee: "",
      day: "",
      menuItems: null 
    };
    this.updateRecommendee = this.updateRecommendee.bind(this);
    this.updateDay = this.updateDay.bind(this);
    this.generateRecs = this.generateRecs.bind(this);
  }

  componentDidMount() {
    this.generateRecs();
  }

  updateRecommendee(option) {
    this.setState({
      recommendee: option.label,
    });
  }

  updateDay(option) {
    this.setState({
      day: option.label,
    });
  }

  generateRecs() {
    // axios.get('api/time/day/recee') or something like that
    axios.get('/api/menuitems')
    .then((resp) => { 
      const items = resp.data.map(item => 
        <MenuItem key={item.name + resp.data.indexOf(item)} id={item.id} index={resp.data.indexOf(item) % 2} itemName={item.name} restaurant={item.restaurant} rating={item.rating} />
      )
      this.setState({ menuItems: items });
    });
  }

  render () {
    return (
      <React.Fragment>
        <Header>What are you craving?</Header>
        <FilterContainer>
          <Text>Top picks for:</Text>
          <DropdownContainer>
          <Select options={recommendeeOptions} defaultValue={recommendeeDefaultOption} onChange={(event) => this.updateRecommendee(event)} />
          <Select options={dayOptions} defaultValue={dayDefaultOption} onChange={(event) => this.updateDay(event)} />
          </DropdownContainer>
          <Button text={"Go"} color={"#EF39FF"} handleClick={() => this.generateRecs()}/>
        </FilterContainer>
        {this.state.menuItems}
        <p>{this.state.recommendee}</p>
        <p><Link to="/menuitem:id">Click here to view menu item</Link></p>
      </React.Fragment>
    )
  }
}

export default Recommendpage;
