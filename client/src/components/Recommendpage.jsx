import React from 'react';
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
    const { day, recommendee } = this.state;
    axios.get(`api/recommendations?day=${day}&time=T12:00&userId=${recommendee}`)
      .then((resp) => {
        const items = resp.data.map((item) => {
          return (
            <MenuItem
              key={item.name + resp.data.indexOf(item)}
              id={item._id}
              index={resp.data.indexOf(item) % 2}
              itemName={item.name}
              restaurant={item.restaurant}
              rating={item.rating}
            />
          );
        });
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
      </React.Fragment>
    )
  }
}

export default Recommendpage;
