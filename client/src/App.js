import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loginpage from './components/Loginpage';
import Recommendpage from './components/Recommendpage';
import MenuItempage from './components/MenuItempage';
import AllMenuspage from './components/AllMenuspage';
import RestaurantMenupage from './components/RestaurantMenupage';
import Profilepage from './components/Profilepage';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Loginpage} />
          <Route exact path="/recommend" component={Recommendpage} />
          <Route exact path="/menuitem/:id" component={MenuItempage} />
          <Route exact path="/allmenus" component={AllMenuspage} />
          <Route exact path="/restaurantmenu/:id" component={RestaurantMenupage} />
          <Route exact path="/profile" component={Profilepage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
