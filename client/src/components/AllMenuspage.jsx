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
      quickService: [],
      loggedIn: false,
      user: null,
    };
    this.populateRestaurants = this.populateRestaurants.bind(this);
  }

  populateRestaurants() {
    axios.get('/api/restaurants')
      .then((resp) => {
        console.log(resp.data);
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

    this.populateRestaurants();
  }

  render () {
    return (
      <React.Fragment>
        <NavBar userName={this.state.loggedIn ? this.state.user.name : "Guest"} />
        <Header>Menus</Header>
        <Container>
          <Subtitle>Dining Halls</Subtitle>
          <Link
            to={{
              pathname: `/restaurantmenu/covel`,
              state: {id: '5dcb728fb9a6804bd50aff58', restName: 'covel'},
            }}
            style={{ textDecoration: 'none' }}
            >
            <Text>Covel Dining</Text>
          </Link>
          <Text>De Neve Dining</Text>
          <Text>FEAST at Rieber</Text>
          <Text>Bruin Plate</Text>
          {/* <h2>Quick Service</h2>
          <p>Bruin Cafe</p>
          <p>Cafe 1919</p>
          <p>Rendezvous</p>
          <p>The Study at Hedrick</p>
          <p>De Neve Late Night</p>
          <p>Bruin Plate Grab & Go Breakfast</p> */}
        </Container>
      </React.Fragment>
    )
  }
}

export default AllMenuspage;