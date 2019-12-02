import React from 'react';
import Select from 'react-select';
import Button from './Button';
import MenuItem from './MenuItem';
import NavBar from './NavBar';
import {
  Text,
  FilterContainer,
  Header,
  FloatRightContainer,
  ButtonContainer,
  DaySelContainer,
} from './StyledRecommendpage';
import { Row, Heading } from './StyledRestaurantMenupage';
import {
  mealOptions,
  mealDefaultOption,
  dayOptions,
  dayDefaultOption
} from '../options';
import axios from 'axios';
import { Menu } from './StyledNavBar';

class RestaurantMenupage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: null,
      restaurantName: this.props.location.state.restName,
      restaurantId: this.props.location.state.id,
      day: "today",
      meal: "lunch",
      menuItems: [],
      stations: [],
    }
    this.fetchMenu = this.fetchMenu.bind(this);
    this.mapMealPeriodToTime = this.mapMealPeriodToTime.bind(this);
    this.updateMealSelection = this.updateMealSelection.bind(this);
    this.getTimeStrings = this.getTimeStrings.bind(this);
    this.generateStation = this.generateStation.bind(this);
    this.updateDaySelection = this.updateDaySelection.bind(this);
    this.getTimeFormatting = this.getTimeFormatting.bind(this);
  }

  mapMealPeriodToTime(restaurant, meal) {
    switch(restaurant) {
      case "Covel":
        if (meal === "lunch") {
          return { startTime: "11:00", endTime: "15:00" };
        }
        if (meal === "dinner") {
          return { startTime: "17:00", endTime: "21:00" };
        }
        else {
          return {startTime: "00:00", endTime: "00:00"};
        }
        break;
      case "FEAST at Rieber":
        if (meal === "lunch") {
          return { startTime: "11:00", endTime: "14:00" };
        }
        if (meal === "dinner") {
          return { startTime: "17:00", endTime: "20:00" };
        }
        else {
          return {startTime: "00:00", endTime: "00:00"};
        }
        break;
      case "De Neve":
        if (meal === "breakfast") {
          return { startTime: "07:00", endTime: "10:00" };
        }
        if (meal === "lunch") {
          return { startTime: "11:00", endTime: "14:00" };
        }
        if (meal === "dinner") {
          return { startTime: "17:00", endTime: "20:00" };
        }
        else {
          return {startTime: "00:00", endTime: "00:00"};
        }
        break;
      case "Bruin Plate":
          if (meal === "breakfast") {
            return { startTime: "07:00", endTime: "09:00" };
          }
        if (meal === "lunch") {
          return { startTime: "11:00", endTime: "14:00" };
        }
        if (meal === "dinner") {
          return { startTime: "17:00", endTime: "20:00" };
        }
        else {
          return {startTime: "00:00", endTime: "00:00"};
        }
        break;
      default:
        return null;
    }
  }

  getTimeStrings() {
    const { restaurantName, meal } = this.state;
    let times = this.mapMealPeriodToTime(restaurantName, meal);
    const timeToArrStart = times.startTime.split(":");
    const timeToArrEnd = times.endTime.split(":");

    let startTimeString = this.getTimeFormatting(timeToArrStart);
    let endTimeString = this.getTimeFormatting(timeToArrEnd);
    return {startTimeString, endTimeString};
  }

  getTimeFormatting(time) {
    let date = new Date();
    if (this.state.day === "tomorrow") {
      date.setDate(date.getDate()+1);
    }

    date.setHours(parseInt(time[0]));
    date.setMinutes(parseInt(time[1]));

    let day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
    let hour = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
    let timeString = `${date.getFullYear()}-${date.getMonth()+1}-${day}T${hour}:00:00.000Z`;
    return timeString;
  }

  fetchMenu() {
    let timeStrings = this.getTimeStrings();
    axios.get(`/api/menus?restaurant="${this.props.location.state.id}"&startTime={"$gte":"${timeStrings.startTimeString}"}&endTime={"$lte":"${timeStrings.endTimeString}"}`)
      .then((resp) => {
        if (resp.data.length === 0) {
          let noMenu = <Header>No menu exists for this time period.</Header>;
          this.setState({menuItems: noMenu});
        } else {
          const curMenu = resp.data[0];
          let menuItems = curMenu.menuItems;
          const menuItemComponents = this.state.stations.map((station) =>
            this.generateStation(station, menuItems));
          this.setState({menuItems: menuItemComponents});
        }
      })
  }

   generateStation(station, menuItems) {
    // generate call to filter all menuitems that match the station
    const stationItems = menuItems.filter(item =>
      item.station === station);

    const stationItemComponents = stationItems.map((item) => <MenuItem
      key={item.name + stationItems.indexOf(item)}
      id={item._id}
      index={stationItems.indexOf(item) % 2}
      itemName={item.name}
      restaurant={this.state.restaurantName}
      rating={item.rating}
      />);

    return (
      <div key={station}>
        <Heading>{station}</Heading>
        {stationItemComponents}
      </div>
    )
  }

  updateMealSelection(option) {
    this.setState({
      meal: option.value,
    });
  }

  updateDaySelection(option) {
    this.setState({
      day: option.value,
    })
  }

  async componentDidMount() {
    axios.get('/auth/user').then(response => {
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

    let restaurant = await axios.get(`/api/restaurants/${this.props.location.state.id}`);
    this.setState({stations: restaurant.data[0].stations});
    this.fetchMenu();
  }

  render() {
    return (
      <div>
        <NavBar userName={this.state.loggedIn ? this.state.user.name : "Guest"} />
        <Header>{this.props.location.state.restName}</Header>
        <FilterContainer>
          <Row>
            <Text>Menu for:</Text>
          </Row>
          <ButtonContainer>
            <Button text={"Go"} color={"#EF39FF"} handleClick={() => this.fetchMenu()} />
          </ButtonContainer>
          <Row>
            <FloatRightContainer>
              <Select options={mealOptions} defaultValue={mealDefaultOption} onChange={(event) => this.updateMealSelection(event)} />
            </FloatRightContainer>
            <DaySelContainer>
              <Select options={dayOptions} defaultValue={dayDefaultOption} onChange={(event) => this.updateDaySelection(event)} />
            </DaySelContainer>
          </Row>
        </FilterContainer>
      {this.state.menuItems}
      </div>
    )
  }
}

export default RestaurantMenupage;