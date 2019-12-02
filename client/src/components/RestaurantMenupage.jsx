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
    this.mapDayToDate = this.mapDayToDate.bind(this);
    this.updateMealSelection = this.updateMealSelection.bind(this);
    // this.convertMilToStdTime = this.convertMilToStdTime.bind(this);
    // this.parseDateString = this.parseDateString.bind(this);
  }

  mapMealPeriodToTime(restaurant, meal) {
    switch(restaurant) {
      case "covel":
        if (meal === "lunch") {
          return { startTime: "11:00", endTime: "2:00" };
        }
        if (meal === "dinner") {
          return { startTime: "5:00", endTime: "9:00" };
        }
        break;
      case "feast":
      case "deneve":
      case "bplate":
        if (meal === "lunch") {
          return { startTime: "11:00", endTime: "2:00" };
        }
        if (meal === "dinner") {
          return { startTime: "5:00", endTime: "8:00" };
        }
        break;
      default:
        return null;
    }
  }

  mapDayToDate(day) {
    const curDay = new Date();
    if (day === "today") {
      return curDay.getDate();
    }
    else {
      return curDay.getDate() + 1;
    }
  }

  // convertMilToStdTime(hour) {
  //   return (hour-8) % 12;
  // }

  // parseDateString(dateStr) {
  //     const dateArr = dateStr.split('-');
  //     if (dateArr.length < 3) { console.error("could not parse date"); return null; }
  //     const year = dateArr[0];
  //     const month = dateArr[1];
  //     const day = dateArr[2].split('T')[0];
  //     // console.log('year', year);
  //     // console.log('month', month);
  //     // console.log('day', day);
  //     const hour = this.convertMilToStdTime(dateArr[2].split('T')[1].split(':')[0]);
  //     const min = dateArr[2].split('T')[1].split(':')[1];
  //     const sec = dateArr[2].split('T')[1].split(':')[2].split('.')[0];
  //     // console.log('hour', hour);
  //     // console.log('min', min);
  //     // console.log('sec', sec);
  //     return { year: year, month: month, day: day, hour: hour, min: min, sec: sec };
  // }

  async fetchMenu() {
    axios.get(`/api/menus?restaurant="${this.props.location.state.id}"&startTime={"$gte":"2019-12-01T17:00:00.000Z"}&endTime={"$lte":"2019-12-01T21:00:00.000Z"}`)
      .then((resp) => {
        console.log(resp.data);

        const mealTimePeriod = this.mapMealPeriodToTime(this.state.restaurantName, this.state.meal);
        console.log(mealTimePeriod);
          const curMenu = resp.data[0];
          console.log(curMenu);
          // const curStartTime = new Date(resp.data[i].startTime);
          // if ((curStartTime.getHours() + ":00") === mealTimePeriod.startTime &&
          //     curStartTime.getDate() === this.mapDayToDate(this.state.day)) {
          //   console.log('found it');

            // let menuItemsArr = [];
            let menuItems = curMenu.menuItems;
            // for (let j = 0; j < menuItems.length; j++){
            //   console.log(menuItems[j]);
            // }
            console.log(this.state.stations);
            const menuItemComponents = this.state.stations.map((station) =>
              this.generateStation(station, menuItems));
            console.log(menuItemComponents);

            this.setState({menuItems:menuItemComponents});




            //   let thing = await axios.get(`/api/menuItems?_id=${curMenu.menuItems[j]}`)
            //     .then((resp) => {
            //       //console.log(resp.data);
            //       // const mItems = resp.data.map((item) => {
            //       //   return <p>item.name</p>
            //       // });
            //       menuItemsArr.push(<p>{resp.data[0]}</p>);
            //       console.log(menuItemsArr);

            //     })
          //       console.log('hey', menuItemsArr);
          //   }
          //   console.log('at the end', menuItemsArr);
          //   this.setState({
          //     menuItems: menuItemsArr,
          //   });
          // }
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
    // return stationItemComponents;

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
    console.log(this.state.meal);
  }

  updateDaySelection(option) {
    this.setState({
      day: option.value,
    })
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

    console.log('what is it', this.props.location.state);
    let restaurant = await axios.get(`/api/restaurants/${this.props.location.state.id}`);
    console.log(restaurant.data[0]);
    this.setState({stations: restaurant.data[0].stations});
    await this.fetchMenu();
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