import React from 'react';
import NavBar from './NavBar';
import MenuItem from './MenuItem';
import Button from './Button';
import {
  Text,
  FilterContainer,
  Header,
  FloatRightContainer,
  ButtonContainer,
  Row,
  DaySelContainer,
} from './StyledRecommendpage';
import {
  recommendeeOptions,
  dayOptions,
  timeOptions,
  recommendeeDefaultOption,
  dayDefaultOption,
  timeDefaultOption
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
      loggedIn: false,
      user: null,
      time: "8:00",
      menuItems: null
    };
    this.updateRecommendee = this.updateRecommendee.bind(this);
    this.updateDay = this.updateDay.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.generateRecs = this.generateRecs.bind(this);
    this.generateRecURL = this.generateRecURL.bind(this);
  }

  componentDidMount() {
    axios.get('/auth/user').then(response => {
      console.log(response.data)
      if (!!response.data.user) {
        this.setState({
          loggedIn: true,
          user: response.data.user
        })
      } else {
        this.setState({
          loggedIn: false,
          user: null
        })
      }
    })


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

  updateTime(option) {
    this.setState({
      time: option.value,
    });
  }

  /**
  * Helper function that generates the URL of the recommendations get request
  * @return {string} - Returns string form of axios get request url
  */
  generateRecURL() {
    const { day, recommendee, time, loggedIn, user } = this.state;
    const thing = new Date();
    const month = thing.getMonth() + 1;
    let date = thing.getDate();
    let userId = recommendee;
    if (day === 'tomorrow'){
      date += 1;
    }
    if (loggedIn) {
      userId = user;
    }
      return `api/recommendations?date=2019-${month}-${date}T${time}-0800&userId=${userId}`;  }

  /**
  * Function that makes axios call to backend to fetch recommended items based on input values
  * @return {Number} - 1 denotes success, 0 denotes failure
  */
  generateRecs() {
    const apiURL = this.generateRecURL();
    axios.get(apiURL)
      .then((resp) => {
        console.log(resp.data);
        
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
        <NavBar userName={this.state.loggedIn ? this.state.user.name : "Guest"} />
        <Header>What are you craving{this.state.loggedIn ? ", " + this.state.user.name : ""}?</Header>
        <FilterContainer>
          <Row>
            <FloatRightContainer>
              <Select className="testing" id="recsel" options={recommendeeOptions} defaultValue={recommendeeDefaultOption} onChange={(event) => this.updateRecommendee(event)} />
            </FloatRightContainer>
            <Text>Top picks for:</Text>
          </Row>
          <ButtonContainer>
            <Button text={"Go"} color={"#EF39FF"} handleClick={() => this.generateRecs()}/>
          </ButtonContainer>
          <Row>
            <FloatRightContainer>
              <Select id="timesel" options={timeOptions} defaultValue={timeDefaultOption} onChange={(event) => this.updateTime(event)} />
            </FloatRightContainer>
            <DaySelContainer>
            <Select id="daysel" options={dayOptions} defaultValue={dayDefaultOption} onChange={(event) => this.updateDay(event)} />                       
            </DaySelContainer>
          </Row>
        </FilterContainer>
        {this.state.menuItems}
      </React.Fragment>
    )
  }
}

export default Recommendpage;
