import React from 'react';
import Select from 'react-select';
import Button from './Button';
import NavBar from './NavBar';
import {
  Text,
  FilterContainer,
  Header,
  FloatRightContainer,
  ButtonContainer,
} from './StyledRecommendpage';
import { Row } from './StyledRestaurantMenupage';
import {
  mealOptions,
  mealDefaultOption,
  dayOptions,
  dayDefaultOption
} from '../options';
import axios from 'axios';

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

  fetchMenu() {
    axios.get(`/api/menus?restaurant=${this.props.location.state.id}startTime={"$gte":"2019-11-24T19:00:00.000Z"}`)
      .then((resp) => {
        //console.log(resp.data);

        const mealTimePeriod = this.mapMealPeriodToTime(this.state.restaurantName, this.state.meal);
        console.log(mealTimePeriod);
        for (let i = 0; i < resp.data.length; i++) {
          const curMenu = resp.data[i];
          const curStartTime = new Date(resp.data[i].startTime);
          // if ((curStartTime.getHours() + ":00") === mealTimePeriod.startTime &&
          //     curStartTime.getDate() === this.mapDayToDate(this.state.day)) {
          //   console.log('found it');

          //   let menuItemsArr = [];
          //   for (let j = 0; j < curMenu.menuItems.length; j++){
          //     //console.log(curMenu.menuItems[j]);
          //     let thing = await axios.get(`/api/menuItems?_id=${curMenu.menuItems[j]}`)
          //       .then((resp) => {
          //         //console.log(resp.data);
          //         // const mItems = resp.data.map((item) => {
          //         //   return <p>item.name</p>
          //         // });
          //         menuItemsArr.push(<p>{resp.data[0]}</p>);
          //         console.log(menuItemsArr);
                  
          //       })
          //       console.log('hey', menuItemsArr);
          //   }
          //   console.log('at the end', menuItemsArr);
          //   this.setState({
          //     menuItems: menuItemsArr,
          //   });
          // }
        }
      })
  }

  updateMealSelection(option) {
    this.setState({
      meal: option.value,
    });
    //console.log(this.state.meal);
  }

  updateDaySelection(option) {
    this.setState({
      day: option.value,
    })
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

    console.log('what is it', this.props.location.state);
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
            <FloatRightContainer>
              <Select options={mealOptions} defaultValue={mealDefaultOption} onChange={(event) => this.updateMealSelection(event)} />
            </FloatRightContainer>
            <Select options={dayOptions} defaultValue={dayDefaultOption} onChange={(event) => this.updateDaySelection(event)} />
          </Row>
          <br />
          <Button text={"Go"} color={"#EF39FF"} handleClick={() => this.fetchMenu()} />

        </FilterContainer>
      {this.state.menuItems}
      </div>
    )
  }
}

export default RestaurantMenupage;