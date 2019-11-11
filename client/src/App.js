import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';

import Loginpage from './components/Loginpage';
import Recommendpage from './components/Recommendpage';
import MenuItempage from './components/MenuItempage';
import './App.css';

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
    const { menuItems } = this.state; // eslint-disable-line
    return (
      <Switch>
        <Route exact path="/" component={Loginpage} />
        <Route exact path="/recommend" component={Recommendpage} />
        <Route exact path="/menuitem" component={MenuItempage} />
      </Switch>
    );
  }
}

export default App;
