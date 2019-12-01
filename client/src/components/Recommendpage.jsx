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
      time: "11:30",
      menuItems: null
    };
    this.updateRecommendee = this.updateRecommendee.bind(this);
    this.updateDay = this.updateDay.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.generateRecs = this.generateRecs.bind(this);
    this.generateRecURL = this.generateRecURL.bind(this);
  }

  async componentDidMount() {
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

    let genRec = await this.generateRecs();
    if (genRec) {
      this.setState({ mounted: true });
    }
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
    let userId = recommendee;
    if (loggedIn) {
      userId = user;
    }
    let date = new Date();
    const timeToArr = time.split(":");
    date.setHours(parseInt(timeToArr[0]));
    date.setMinutes(parseInt(timeToArr[1]));
    if (day === 'tomorrow'){
      date.setDate(date.getDate() + 1);
      date += 1;
    }
    return `api/recommendations?date=${date}&userId=${userId}`;
  }

  /**
  * Function that makes axios call to backend to fetch recommended items based on input values
  * @return {Number} - 1 denotes success, 0 denotes failure
  */
  async generateRecs() {
    const apiURL = this.generateRecURL();
    let items = await axios.get(apiURL);
    if (items == null) {
      console.error("error fetching from recommendations api");
      return 0;
    }
    items = items.data;
    for (let i = 0; i < items.length; i++) { 
      let itemRest = await axios.get(`/api/restaurants/${items[i].restaurant}`) || null;
      if (itemRest == null) {
        console.error("error fetching from restaurants");
        return 0;
      }
      items[i].restaurant = itemRest.data[0].name;
    }
    const itemComponents = items.map((item) => {
      return (<MenuItem
        key={item.name + items.indexOf(item)}
        id={item._id}
        index={items.indexOf(item) % 2}
        itemName={item.name}
        restaurant={item.restaurant}
        rating={item.rating}
        />);
    })
    this.setState({ menuItems: itemComponents });
    return 1;
  }

  render () {
    const { loggedIn, user, menuItems} = this.state;
    return (
      <React.Fragment>
        <NavBar userName={loggedIn ? user.name : "Guest"} />
        <Header>What are you craving{loggedIn ? ", " + user.name : ""}?</Header>
        <FilterContainer>
          <Row>
            <FloatRightContainer>
              <Select id="recsel" isDisabled={!loggedIn} options={recommendeeOptions} defaultValue={recommendeeDefaultOption} onChange={(event) => this.updateRecommendee(event)} />
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
        {menuItems}
      </React.Fragment>
    )
  }
}

export default Recommendpage;
