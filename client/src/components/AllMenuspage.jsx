import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import { Header } from './StyledRecommendpage';
import { Container, Subtitle, Text } from './StyledAllMenuspage';
import axios from 'axios';

class AllMenuspage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diningHalls: [],
      loggedIn: false,
      user: null,
    };
    this.populateRestaurants = this.populateRestaurants.bind(this);
  }

  async populateRestaurants() {
    const allRest = await axios.get('/api/restaurants')
      .catch((err) => { console.error(err) });
    let restArr = [];
    for (let i = 0; i < allRest.data.length; i++){
      restArr.push(
        <Link
        to={{
          pathname: `/restaurantmenu/${allRest.data[i].name}`,
          state: {id: allRest.data[i].id, restName: allRest.data[i].name},
        }}
        style={{ textDecoration: 'none' }}
        ><Text>{allRest.data[i].name}</Text>
        </Link>);
    }
    this.setState({ diningHalls: restArr });
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

    await this.populateRestaurants();
  }

  render () {
    return (
      <React.Fragment>
        <NavBar userName={this.state.loggedIn ? this.state.user.name : "Guest"} />
        <Header>Menus</Header>
        <Container>
          <Subtitle>Dining Halls</Subtitle>
          {this.state.diningHalls}
        </Container>
      </React.Fragment>
    )
  }
}

export default AllMenuspage;
