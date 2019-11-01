import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

const config = require('./config/config');


class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleClick() {
    console.log('Clicked!');
    console.log(config.local_backend);
    axios.get(`${config.local_backend}/api/menuitems`)
      .then((resp) => { console.log(resp.data); this.setState({ menuItems: resp.data }); });
  }

  render() {
    const { menuItems } = this.state;
    return (
      <div className="button__container">
        <button type="button" onClick={this.handleClick.bind(this)}>
          Click Me
        </button>
        <p>
          menu items:
          {' '}
          {JSON.stringify(menuItems)}
        </p>
      </div>
    );
  }
}

export default App;
