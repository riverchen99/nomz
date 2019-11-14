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
import Select from 'react-select';

class Recommendpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      mounted: false,
      recommendee: "everyone",
      day: "today",
      menuItems: null
    };
    this.updateRecommendee = this.updateRecommendee.bind(this);
    this.updateDay = this.updateDay.bind(this);
    this.generateRecs = this.generateRecs.bind(this);
  }

  componentDidMount() {
    this.generateRecs();
    this.setState({
      mounted: true,
    })
  }

  updateRecommendee(option) {
    this.setState({
      recommendee: option.value,
    });
  }

  updateDay(option) {
    this.setState({
      day: option.value,
    });
  }

 /**
 * Function that makes axios call to backend to fetch recommended items based on input values
 * @return {Number} - 1 denotes success, 0 denotes failure
 */
  generateRecs() {
        //axios.get('api/menuitems')
    //axios.get(`api/time/day/recommendations?day=${this.state.day}&time=T09:00&userId=${this.state.recommendee}`)
    axios.get('api/recommendations?day=today&time=T09:00&userId=Mufasa')
    .then((resp) => { 
      console.log(resp.data);
      const items = resp.data.map(item => {
        return <MenuItem
          key={item.name + resp.data.indexOf(item)}
          id={item._id}
          index={resp.data.indexOf(item) % 2}
          itemName={item.name}
          restaurant={item.restaurant}
          rating={item.rating}
        />
      })
      this.setState({ menuItems: items });
      return 1;
    })
    .catch((error) => { 
      console.log(error);
      return 0;
    });
  }

  render () {
    return (
      <React.Fragment>
        <Header>What are you craving?</Header>
        <FilterContainer>
          <Text>Top picks for:</Text>
          <DropdownContainer>
          <Select id="recsel" options={recommendeeOptions} defaultValue={recommendeeDefaultOption} onChange={(event) => this.updateRecommendee(event)} />
          <Select id="daysel" options={dayOptions} defaultValue={dayDefaultOption} onChange={(event) => this.updateDay(event)} />
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
