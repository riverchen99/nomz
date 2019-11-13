import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loginpage from './components/Loginpage';
import Recommendpage from './components/Recommendpage';
import MenuItempage from './components/MenuItempage';
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
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
