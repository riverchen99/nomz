import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loginpage from './components/Loginpage';
import Recommendpage from './components/Recommendpage';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleClick() {
    axios.get('/api/menuitems')
      .then((resp) => { console.log(resp.data); this.setState({ menuItems: resp.data }); });
  }

  render() {
    const { menuItems } = this.state;
    return (
      <Switch>
        <Route exact path="/" component={Loginpage} />
        <Route exact path="/recommend" component={Recommendpage} />
      </Switch>
      
    );
  }
}

export default App;
